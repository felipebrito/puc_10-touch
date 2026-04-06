export const menuItems = [
    {
        id: 'perigo-extincao',
        label: 'O PERIGO DA\nEXTINÇÃO',
        image: '/assets/images/perigo_extincao.png',
    },
    {
        id: 'boto',
        label: 'BOTO',
        scientificName: 'BOTO (GOLFINHO DA TAINHA)',
        binomialName: 'Tursiops gephyreus',
        image: '/assets/images/boto.png',
        guideImage: '/assets/guides/page-09.png',
        description: `O boto é uma espécie de mamífero marinho que só ocorre nas águas costeiras do sul do Brasil, Uruguai e centro-norte da Argentina. A espécie está ameaçada de extinção com uma população estimada em menos de 500 indivíduos e que ainda está diminuindo.\n\nÉ famoso por suas interações com pescadores artesanais, um comportamento conhecido como pesca cooperativa, que ocorre principalmente na Barra do Rio Tramandaí (RS) e em Laguna (SC). Os botos, que residem nestas áreas, e os pescadores artesanais cooperam a décadas na pesca da tainha, que beneficiam ambas as partes.`,
        externalUrl: 'https://www.ufrgs.br/ceclimar/projeto-botos-da-barra/',
    },
    {
        id: 'toninha',
        label: 'TONINHA',
        image: '/assets/images/toninha.png',
    },
    {
        id: 'baleia-jubarte',
        label: 'BALEIA\nJUBARTE',
        image: '/assets/images/baleia_jubarte.png',
    },
    {
        id: 'baleia-franca',
        label: 'BALEIA\nFRANCA - AUSTRAL',
        image: '/assets/images/baleia_franca.png',
    },
    {
        id: 'tartarugas-marinhas',
        label: 'TARTARUGAS\nMARINHAS',
        image: '/assets/images/tartarugas_marinhas.png',
    },
    {
        id: 'peixe-boi',
        label: 'PEIXE-BOI\nMARINHO',
        image: '/assets/images/peixe_boi.png',
    },
    {
        id: 'tubaroes',
        label: 'TUBARÕES',
        image: '/assets/images/tubaroes.png',
    },
    {
        id: 'arraias',
        label: 'ARRAIAS',
        image: '/assets/images/arraias.png',
    },
];

// Dados detalhados para navegação interna / sub-páginas
export const speciesDetails = {
    'tubarao-mangona': {
        label: 'TUBARÃO-MANGONA',
        scientificName: 'TUBARÃO-MANGONA',
        binomialName: 'Carcharias taurus',
        image: '/assets/images/tubaroes.png',
        guideImage: '/assets/guides/page-19.png',
        description: `Carcharias taurus é um tubarão de grande porte, com distribuição costeira no mundo inteiro; no Brasil, ocorre no Sudeste e Sul. O tamanho máximo comprovado da espécie é de aproximadamente 3,2 m de comprimento chegando a pesar por volta de 300 kg.\n\nProduz apenas dois filhotes grandes por gestação. Como resultado, as taxas anuais de crescimento da população são muito baixas, reduzindo sua capacidade de sustentar a pressão da pesca. C. taurus é classificado como Criticamente em Perigo (CR) pela Lista Vermelha da IUCN e ICMBio.`,
        externalUrl: 'https://vivaopeixeboi.org.br/',
    },
    'tubarao-martelo': {
        label: 'TUBARÃO-MARTELO-GRANDE',
        scientificName: 'TUBARÃO-MARTELO-GRANDE',
        binomialName: 'Sphyrna mokarran',
        image: '/assets/images/tubaroes.png',
        guideImage: '/assets/guides/page-20.png',
        description: `Sphyrna mokarran é um grande tubarão-martelo tropical e sub-tropical, amplamente distribuído. É altamente valorizado por suas barbatanas, sofre mortalidade muito elevada como captura incidental e se reproduz apenas uma vez a cada dois anos, tornando-se vulnerável à sobre-exploração e depleção da população.\n\nDeve-se considerar que é um dos maiores tubarões existentes, podendo atingir 6,1 m, com alto valor comercial no Brasil, cujas ameaças não cessaram. S. mokarran é classificado como Criticamente em Perigo (CR) pela Lista Vermelha da IUCN e ICMBio.`,
        externalUrl: 'https://vivaopeixeboi.org.br/',
    },
    'cacao-anjo': {
        label: 'CAÇÃO-ANJO-DE-ASA-LONGA',
        scientificName: 'CAÇÃO-ANJO-DE-ASA-LONGA',
        binomialName: 'Squatina argentina',
        image: '/assets/images/tubaroes.png',
        guideImage: '/assets/guides/page-21.png',
        description: `O cação-anjo-de-asa-longa, também conhecido como tubarão-anjo-argentino, é uma espécie de peixe cartilaginoso, com um comprimento máximo de 1,4 metros, endêmica do Atlântico Sul ocidental.\n\nNo Brasil, há registros da espécie desde o Rio de Janeiro até o Rio Grande do Sul. As pescarias com redes de arrasto e emalhe são a principal ameaça sobre a espécie, e continuam a operar em seu habitat. A espécie é de longa vida e possui baixo potencial reprodutivo. S. argentina foi categorizada como Criticamente em Perigo (CR) pela Lista Vermelha da IUCN e ICMBio.`,
        externalUrl: 'https://vivaopeixeboi.org.br/',
    },
    'raia-jamanta': {
        label: 'RAIA-JAMANTA',
        scientificName: 'RAIA-JAMANTA',
        binomialName: 'Mobula birostris',
        image: '/assets/images/arraias.png',
        guideImage: '/assets/guides/page-22.png',
        description: `Mobula birostris, também chamada de jamanta, é a maior raia conhecida, atingindo até 710 cm de largura de disco. Tem distribuição circunglobal em águas temperadas e tropicais.\n\nAs maiores populações ocorrem ao longo das áreas das plataformas continentais suportadas pela ressurgência, próximo a cadeias de ilhas e elevações submarinas. Espécie pelágica, suscetível à rede de emalhe-de-surface e meia-água, sendo ocasionalmente capturada no arrasto-de-fundo (provavelmente no levantar e descer das redes). M. birostris foi categorizada como Em Perigo (EN) pela Lista Vermelha da IUCN.`,
        externalUrl: 'https://vivaopeixeboi.org.br/',
    }
};
