# zdar

To install dependencies:

```bash
bun install
```

To run db:

```
bunx prisma db push
```

To run:

```bash
bun start
```

This project was created using `bun init` in bun v1.1.38. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

.env:

```
PORT = 4000
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/zdar
JWT_SECRET=secret
```
