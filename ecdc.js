import bc from "bcrypt";

export async function enc(p) {
    const sR = 14;
    const hP = await bc.hash(p, sR);
    return hP;  // fixed variable name
}

export async function dnc(hp, p) {
    const v = await bc.compare(hp, p); // bc.compare(password, hash)
    return v;
}
