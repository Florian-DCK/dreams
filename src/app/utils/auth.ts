const bcrypt = require('bcrypt');

export function hashPassword(password: string): string {
    return bcrypt.hash(password, 10).then(function(hash: string){
        return hash;
    })
}

export function comparePassword(password: string, hash: string): boolean {
    return bcrypt.compare(password, hash).then(function(result: boolean){
        return result;
    })
}