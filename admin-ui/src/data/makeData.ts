import {faker} from "@faker-js/faker";

export type Person = {
    first_name: string;
    last_name: string;
    dob: string;
    age: number;
    visits: number;
    progress: number;
    status: "relationship" | "complicated" | "single";
    subRows?: Person[];
    id: number;
};

export type Company = {
    name: string;
    lastName: string;
    dob: string;
    age: number;
    visits: number;
    progress: number;
    status: "relationship" | "complicated" | "single";
    subRows?: Person[];
    id: number;
};

const range = (len: number) => {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

const newPerson = (): Person => {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        dob: faker.date.past().toLocaleDateString(),
        age: faker.number.int(40),
        visits: faker.number.int(1000),
        progress: faker.number.int(100),
        status: faker.helpers.shuffle<Person["status"]>([
            "relationship",
            "complicated",
            "single",
        ])[0]!,
        id: faker.number.int(40),
    };
};

const newCompany = (): Company => {
    return {
        name: faker.company.name(),
        lastName: faker.person.lastName(),
        dob: faker.date.past().toLocaleDateString(),
        age: faker.number.int(40),
        visits: faker.number.int(1000),
        progress: faker.number.int(100),
        status: faker.helpers.shuffle<Person["status"]>([
            "relationship",
            "complicated",
            "single",
        ])[0]!,
        id: faker.number.int(40),
    };
};

export function makeData(...lens: number[]) {
    const makeDataLevel = (depth = 0): Person[] => {
        const len = lens[depth]!;
        return range(len).map((d): Person => {
            return {
                ...newPerson(),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
            };
        });
    };

    return makeDataLevel();
}

export function makeCompanyData(...lens: number[]) {
    const makeDataLevel = (depth = 0): Company[] => {
        const len = lens[depth]!;
        return range(len).map((d): Company => {
            return {
                ...newCompany(),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
            };
        });
    };

    return makeDataLevel();
}
