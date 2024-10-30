import * as bcrypt from 'bcryptjs';

class BcryptService {
    private readonly saltRounds: number = 10;

    async hashPassword(password: string): Promise<string> {
        const salt: string = await bcrypt.genSalt(this.saltRounds);
        return bcrypt.hash(password, salt);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    async generateSalt(): Promise<string> {
        return bcrypt.genSalt(this.saltRounds);
    }
}

export default new BcryptService();




