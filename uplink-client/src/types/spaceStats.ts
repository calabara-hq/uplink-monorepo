import { Edition } from "./edition";
import { User } from "./user";

export type SpaceStats = {
    editions: Array<{ edition: Edition, totalMints: number }>;
    totalEditions: number;
    totalMints: number;
    topMintsUser: User | null;
    topAppearanceUser: User | null;
}