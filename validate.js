const crypto = require('crypto');


async function validate(seed, index) {
    const tigerStr = "tiger";
    const dragonStr = "dragon";

    const dragonSeed = seed + dragonStr + index;
    const tigerSeed = seed + tigerStr + index;

    let digest = await getHashByte(dragonSeed);

    let number = BigInt('0x' + Array.from(digest).map(b => b.toString(16).padStart(2, '0')).join(''));
    number = number % BigInt(51);
    let dragon = number == 0 ? 51 : Number(number);

    digest = await getHashByte(tigerSeed);
    number = BigInt('0x' + Array.from(digest).map(b => b.toString(16).padStart(2, '0')).join(''));
    number = number % BigInt(50);
    let tiger = number == 0 ? 50 : Number(number);
    let poker = await getPoker();
    let dragonPoker = poker[dragon];
    poker.splice(dragon, 1);
    let tigerPoker = poker[tiger];
    console.log("dragonPoker:", dragonPoker);
    console.log("tigerPoker:", tigerPoker);
    console.log("dragon:", dragon);
    console.log("tiger:", tiger);
    return { dragonPoker, tigerPoker }
}

async function getSeedHash(seed) {
    let digest = await getHashByte(seed);
    return Array.from(digest).map(b => b.toString(16).padStart(2, '0')).join('');

}

async function getHashByte(seed) {
    const encoder = new TextEncoder();
    const data = encoder.encode(seed);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    return new Uint8Array(hash);

}

async function getPokerFromResult(result) {
    let poker = await getPoker();
    const [dragonIndex, tigerIndex] = result.split(',').map(Number);
    const dragonPoker = poker[dragonIndex];
    const tigerPoker = poker[tigerIndex];
    return `dragon: ${dragonPoker}, tiger: ${tigerPoker}`;
}

async function getPoker() {
    const pokerColor = "♠♥♣♦";
    const pokerNumber = "A23456789XJQK";
    let poker = [];
    for (let i = 0; i < pokerNumber.length; i++) {
        for (let j = 0; j < pokerColor.length; j++) {
            poker.push(pokerColor.charAt(j) + pokerNumber.charAt(i));
        }
    }
    return poker;
}


