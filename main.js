function element(id) {
    return document.getElementById(id)
}

const templates = {
    "t":'<<4a5dca4gca3gca5da3dca8cda8dca5ga5 g>gaaaaaaaaaaaaaaa>',
    "3d": '<3<4aaaaadaagaaadagadagadaadaaadaagaaaadaagaaaaag>ac>',
    "mosaique": `ccc

    aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa
    daaa
    aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa
    daaa
    aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa
    daaa
    aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa
    
    aaaaa
    
    aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa
    daaa
    aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa
    daaa
    aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa
    daaa
    aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa ac aadaadaadaadaa
    `
}

window.addEventListener('load', () => {
    const LARGEUR = 150
    const HAUTEUR = 60
    const HAUT = 0,
        DROITE = 1,
        BAS = 2,
        GAUCHE = 3
    const COULEURS = [
        'green',
        'yellow',
        'purple',
        'pink',
        'orange',
        'grey',
        '#ef1143',
        '#11ef2f',
        '#32b6ef'
    ]

    let contexte = {
        depart: { x: Math.floor(LARGEUR / 2), y: Math.floor(HAUTEUR / 2) }
    }

    element('programme').value = localStorage.getItem('programme') || '<aadc>'
    element('programme').addEventListener('input', () => {
        update()
        localStorage.setItem('programme', element('programme').value)
    })

    function update() {
        let html = ''
        for (let y = 0; y < HAUTEUR; y++) {
            html = html + '<div>'

            for (let x = 0; x < LARGEUR; x++) {
                html = html + '<div></div>'
            }

            html = html + '</div>'
        }

        let terrain = element('terrain')
        terrain.innerHTML = html

        terrain
            .children.item(contexte.depart.y)
            .children.item(contexte.depart.x)
            .classList.add('start')

        let position = {
            instruction: 0,
            x: contexte.depart.x,
            y: contexte.depart.y,
            d: HAUT,
            couleur: 0,
            stack: []
        }

        let avance = (arg) => {
            let incr = arg || 1

            for (let i = 0; i < incr; i++) {
                switch (position.d) {
                    case HAUT: position.y -= 1; break
                    case DROITE: position.x += 1; break
                    case BAS: position.y += 1; break
                    case GAUCHE: position.x -= 1; break
                }

                terrain
                    .children.item(position.y)
                    .children.item(position.x)
                    .style.background = COULEURS[position.couleur]
            }
        }

        let tourneDroite = () => {
            position.d = (position.d + 1) % 4
        }

        let tourneGauche = () => {
            position.d = (position.d + 3) % 4
        }

        let changeCouleur = () => {
            position.couleur = (position.couleur + 1) % COULEURS.length
        }

        let empileBoucle = (arg) => {
            let compte = 4
            if (!isNaN(arg))
                compte = arg

            position.stack.unshift({ instruction: position.instruction, compte })
        }

        let depileBoucle = () => {
            if (!position.stack.length) {
                console.log(`> without <`)
                return
            }

            position.stack[0].compte--
            if (position.stack[0].compte > 0)
                position.instruction = position.stack[0].instruction
            else
                position.stack.shift()
        }

        let code = '' + element('programme').value.toLowerCase()
        while (position.instruction < code.length) {
            let instruction = code.charAt(position.instruction)
            let instructionPosition = position.instruction

            position.instruction++

            let arg = ''
            while (position.instruction < code.length && !isNaN(parseInt(code.charAt(position.instruction))))
                arg += code.charAt(position.instruction++)
            arg = parseInt(arg)

            console.log(`exec ${instruction} @ ${instructionPosition} (${arg})`)

            switch (instruction) {
                case 'a': avance(arg); break
                case 'g': tourneGauche(arg); break
                case 'd': tourneDroite(arg); break
                case 'c': changeCouleur(arg); break
                case '<': empileBoucle(arg); break
                case '>': depileBoucle(arg); break
            }
        }
    }

    update()
})