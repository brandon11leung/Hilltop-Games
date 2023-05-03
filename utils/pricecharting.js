import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import * as helpers from '../helpers.js';
const PRICECHARTING_API_KEY = "092368540ded1ff28889f409595b7d8cef234618";
const consoleArr = ["3DO", "Action Max", "Amiga", "Amiga CD32", "Amiibo", "Amiibo Cards", "Arcadia 2001", "Asian English Nintendo 3DS", "Asian English PSP", "Asian English Playstation 3", "Asian English Playstation 4", "Asian English Playstation 5", "Asian English Playstation Vita", "Asian English Switch", "Atari 2600", "Atari 400", "Atari 5200", "Atari 7800", "Atari Lynx", "Atari ST", "Bally Astrocade", "CD-i", "Colecovision", "Commodore 16", "Commodore 64", "Disney Infinity", "Dreamcast Magazine", "Electronic Gaming Monthly", "Evercade", "FM Towns Marty", "Fairchild Channel F", "Famicom", "Famicom Disk System", "Game & Watch", "Game Informer", "Game Wave", "Game.Com", "GameBoy", "GameBoy Advance", "GameBoy Color", "GamePro", "Gamecube", "Gizmondo", "HyperScan", "Intellivision", "JP GameBoy", "JP GameBoy Advance", "JP GameBoy Color", "JP Gamecube", "JP MSX", "JP MSX2", "JP Neo Geo", "JP Neo Geo AES", "JP Neo Geo CD", "JP Neo Geo Pocket", "JP Neo Geo Pocket Color", "JP Nintendo 3DS", "JP Nintendo 64", "JP Nintendo DS", "JP Nintendo Switch", "JP PC Engine", "JP PC Engine CD", "JP PSP", "JP Playstation", "JP Playstation 2", "JP Playstation 3", "JP Playstation 4", "JP Playstation 5", "JP Playstation Vita", "JP Sega Dreamcast", "JP Sega Game Gear", "JP Sega Mark III", "JP Sega Mega CD", "JP Sega Mega Drive", "JP Sega Pico", "JP Sega Saturn", "JP Super 32X", "JP Virtual Boy", "JP Wii", "JP Wii U", "JP Xbox", "JP Xbox 360", "JP Xbox One", "JP Xbox Series X", "Jaguar", "Lego Dimensions", "Magnavox Odyssey", "Magnavox Odyssey 2", "Magnavox Odyssey 300", "Mattel Aquarius", "MegaZone", "Microvision", "Mini Arcade", "N-Gage", "NES", "Neo Geo", "Neo Geo AES", "Neo Geo CD", "Neo Geo Pocket Color", "Nintendo 3DS", "Nintendo 64", "Nintendo DS", "Nintendo Power", "Nintendo Switch", "PAL Amiga CD32", "PAL GameBoy", "PAL GameBoy Advance", "PAL GameBoy Color", "PAL Gamecube", "PAL MSX", "PAL MSX2", "PAL Mega Drive 32X", "PAL NES", "PAL Neo Geo Pocket Color", "PAL Nintendo 3DS", "PAL Nintendo 64", "PAL Nintendo DS", "PAL Nintendo Switch", "PAL PSP", "PAL Playstation", "PAL Playstation 2", "PAL Playstation 3", "PAL Playstation 4", "PAL Playstation 5", "PAL Playstation Vita", "PAL Sega Dreamcast", "PAL Sega Game Gear", "PAL Sega Master System", "PAL Sega Mega CD", "PAL Sega Mega Drive", "PAL Sega Pico", "PAL Sega Saturn", "PAL Super Nintendo", "PAL Vectrex", "PAL Videopac G7000", "PAL Videopac G7400", "PAL Wii", "PAL Wii U", "PAL Xbox", "PAL Xbox 360", "PAL Xbox One", "PAL Xbox Series X", "PC FX", "PC Gamer", "PC Games", "PSP", "Pippin", "Playstation", "Playstation 2", "Playstation 3", "Playstation 4", "Playstation 5", "Playstation Vita", "Pokemon Mini", "Rumble U", "Sega 32X", "Sega CD", "Sega Dreamcast", "Sega Game Gear", "Sega Genesis", "Sega Master System", "Sega Pico", "Sega Saturn", "Sharp X68000", "Skylanders", "Starlink", "Stoneheart", "Strategy Guide", "Super Famicom", "Super Nintendo", "Supervision", "TI-99", "Tapwave Zodiac", "Tiger R-Zone", "TurboGrafx CD", "TurboGrafx-16", "VTech Socrates", "Vectrex", "Vic-20", "Virtual Boy", "Wholesale", "Wii", "Wii U", "WonderSwan", "WonderSwan Color", "Xbox", "Xbox 360", "Xbox One", "Xbox Series X", "ZX Spectrum"];
const hill = ["efghfe"]

export const priceChartingSearch = async (searchItemTerm, console) => {
    
    const { data } = await axios.get(`https://www.pricecharting.com/api/products?t=${process.env.PRICECHARTING_API_KEY}&q=${searchItemTerm}`);
    let filteredArr = [];
    for (let i = 0; i < data.products.length; i++) {
        if (consoleArr.includes(data.products[i]["console-name"]) == true) {
            filteredArr.push(data.products[i]);
        }
    }
    return filteredArr;
}

console.log(await priceChartingSearch("pokemon emerald"))

