import bcrypt from "bcrypt";

export async function createHash(password) {
    return await bcrypt.hash(password, parseInt(process.env.SALT_COUNT));
}

export async function verifyHash(password, hash) {
    return await bcrypt.compare(password, hash);
}
