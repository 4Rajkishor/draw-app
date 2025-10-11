import z from "zod";

export const SignUpSchema=z.object({
    username:z.string().max(20),
    email:z.email(),
    password:z.string().max(10)
});

export const SigninSchema=z.object({

    password:z.string().max(10),
    email:z.string()
});

export const CreateRoomSchema=z.object({
    slug:z.string()
})