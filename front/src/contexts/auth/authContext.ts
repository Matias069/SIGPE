import { createContext } from "react";
import type { AuthContextType } from "./types";

// Criação do Contexto
export const authContext = createContext<AuthContextType | undefined>(undefined);