

function Component(target: Function) {
    console.log(target);
}

@Component
export class User {
    id: number;

    updateId(newId: number) {
        this.id = newId;
        return this.id;
    }
}

console.log(new User().id);