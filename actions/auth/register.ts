"use server";

import { RegisterSchema } from "@/app/types";
import { z } from "zod";
import * as argon from "argon2";
import { db } from "@/lib/db/db";


