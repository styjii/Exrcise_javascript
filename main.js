import readline from "readline-sync";
import fs from "fs";

const armsData = JSON.parse(
    fs.readFileSync("./data/arms.json", "utf-8")
);

const armTypesData = JSON.parse(
    fs.readFileSync("./data/armTypes.json", "utf-8")
);


class ArmsManager {
    constructor() {
        this.arms = { ...armsData };
        this.armTypes = { ...armTypesData };
    }

    /**
     * Check if there are no arms stored
     * @returns {boolean}
     */
    #isEmptyArms() {
        return Object.keys(this.arms).every((key) => key === "increment");
    }

    /**
     * Display arm types
     * @returns {string}
     */
    displayArmTypes() {
        return Object.entries(this.armTypes)
            .map(([id, name]) => `${id} : ${name}`)
            .join("\n");
    }

    /**
     * Display arms list
     * @returns {string}
     */
    displayArms() {
        if (this.#isEmptyArms()) {
            return "Aucune arme";
        }

        return Object.entries(this.arms)
            .filter(([key]) => key !== "increment")
            .map(([key, arm]) => {
                const index = Number(key.replace("arm", ""));
                const details = Object.entries(arm)
                    .map(([k, v]) => `${k} : ${v}`)
                    .join(" - ");
                return `${index} : ${details}`;
            })
            .join("\n");
    }

    /**
     * Add a new arm
     */
    addArm() {
        const name = readline.question(
            "Quel est le nom de l'arme que vous voulez ajouter ? "
        );

        console.log(this.displayArmTypes());

        let type;
        while (true) {
            type = Number(readline.question("Quel est son type ? "));
            if (Number.isInteger(type) && type >= 1 && type <= 3) {
                break;
            }
            console.log("Valeur invalide");
        }

        const index = this.arms.increment ?? 1;
        this.arms.increment = index + 1;

        this.arms[`arm${index}`] = {
            name,
            type,
        };
    }

    /**
     * Remove an arm by index
     */
    removeArm() {
        const existingIndexes = Object.keys(this.arms)
            .filter((key) => key !== "increment")
            .map((key) => Number(key.replace("arm", "")));

        let index;
        while (true) {
            index = Number(
                readline.question(
                    "Quel est le numéro de l'arme que vous voulez supprimer ? "
                )
            );

            if (Number.isInteger(index) && existingIndexes.includes(index)) {
                break;
            }

            console.log("Valeur invalide ou inexistante");
        }

        delete this.arms[`arm${index}`];
    }

    /**
     * Save arms to JSON file
     */
    save() {
        fs.writeFileSync(
            "./data/arms.json",
            JSON.stringify(this.arms, null, 2)
        );
    }
}

/* ===================== MENU ===================== */

const manager = new ArmsManager();

const MENU = `
1/ afficher les armes
2/ ajouter une arme
3/ supprimer une arme
0/ quitter
`;

while (true) {
    console.log(MENU);
    const choice = Number(readline.question("Quel est votre choix ? "));

    if (!Number.isInteger(choice) || choice < 0 || choice > 3) {
        console.log("Choix invalide");
        continue;
    }

    switch (choice) {
        case 0:
            manager.save();
            console.log("Sauvegarde effectuée. Au revoir !");
            process.exit(0);

        case 1:
            console.log(manager.displayArms());
            break;

        case 2:
            manager.addArm();
            break;

        case 3:
            manager.removeArm();
            break;
    }
}
