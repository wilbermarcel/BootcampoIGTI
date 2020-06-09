import { promises } from 'fs';
const { readFile, writeFile } = promises;

const start = async () => {
    if (await generateJson()) {
        await top5Cities('DESC');
        await top5Cities('ASC');
        await topCityNameSizeofStates('DESC', 'MULTIPLE');
        await topCityNameSizeofStates('ASC', 'MULTIPLE');
        await topCityNameSizeofStates('DESC', 'ONEBIGGER');
        await topCityNameSizeofStates('DESC', 'ONESMALLER');
    }
};

const generateJson = async () => {
    try {
        const cities = await readFile('Cidades.json');
        const states = await readFile('Estados.json');
        const citiesJson = JSON.parse(cities);
        const statesJson = JSON.parse(states);

        statesJson.forEach((state) => {
            let newJson = [];
            citiesJson.forEach((city) => {
                if (city.Estado === state.ID) newJson = [...newJson, city.Nome];
            });
            if (newJson.length > 0)
                writeFile(
                    `./data/${state.Sigla}.json`,
                    JSON.stringify(newJson)
                );
        });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

const numberOfCities = async (paramState) => {
    try {
        const state = await readFile(`./data/${paramState}.json`);
        const stateJson = JSON.parse(state);
        return stateJson.length;
    } catch (e) {
        console.log(e);
        return 0;
    }
};

const top5Cities = async (order) => {
    let response = [];
    let returnTop5 = [];
    try {
        const states = await readFile('Estados.json');
        const statesJson = JSON.parse(states);
        for (const state of statesJson) {
            response = [
                ...response,
                { uf: state.Sigla, amount: await numberOfCities(state.Sigla) },
            ];
        }
        response.sort((a, b) => {
            return order === 'DESC' ? b.amount - a.amount : a.amount - b.amount;
        });
        for (let i = 0; i < 5; i++) {
            returnTop5 = [
                ...returnTop5,
                `${response[i].uf} - ${response[i].amount}`,
            ];
        }
        console.log(returnTop5);
    } catch (e) {
        console.log(e);
    }
};

const topCityNameSizeofStates = async (order, mode) => {
    try {
        let response;
        let cityAuxiliary = '';
        let stateAuxiliary = '';
        if (mode === 'MULTIPLE') response = [];
        else response = '';
        const states = await readFile('Estados.json');
        const statesJson = JSON.parse(states);
        for (const state of statesJson) {
            const stateUF = await readFile(`./data/${state.Sigla}.json`);
            const stateUFJson = JSON.parse(stateUF);
            if (mode === 'MULTIPLE') cityAuxiliary = '';
            stateUFJson.forEach((city) => {
                if (order === 'DESC') {
                    if (mode === 'MULTIPLE' || mode === 'ONEBIGGER') {
                        if (city.length > cityAuxiliary.length) {
                            cityAuxiliary = city;
                            if (mode !== 'MULTIPLE')
                                stateAuxiliary = state.Sigla;
                        } else if (city.length === cityAuxiliary.length) {
                            if (!(cityAuxiliary - city)) {
                                cityAuxiliary = city;
                                if (mode !== 'MULTIPLE') {
                                    stateAuxiliary = state.Sigla;
                                }
                            }
                        }
                    } else if (mode === 'ONESMALLER') {
                        if (cityAuxiliary === '') cityAuxiliary = city;
                        else {
                            if (city.length < cityAuxiliary.length) {
                                cityAuxiliary = city;
                                stateAuxiliary = state.Sigla;
                            } else if (city.length === cityAuxiliary.length) {
                                if (city < cityAuxiliary) {
                                    cityAuxiliary = city;
                                    stateAuxiliary = state.Sigla;
                                }
                            }
                        }
                    }
                } else {
                    if (cityAuxiliary === '') cityAuxiliary = city;
                    else {
                        if (city.length < cityAuxiliary.length) {
                            cityAuxiliary = city;
                        } else if (city.length === cityAuxiliary.length) {
                            cityAuxiliary =
                                cityAuxiliary < city ? cityAuxiliary : city;
                        }
                    }
                }
            });
            if (mode === 'MULTIPLE') {
                response = [...response, `${cityAuxiliary} - ${state.Sigla}`];
            } else {
                response = `${cityAuxiliary} - ${stateAuxiliary}`;
            }
        }
        console.log(response);
    } catch (e) {
        console.log(e);
    }
};

start();
