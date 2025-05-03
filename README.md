# Web Playground

> [NOTE]: WIP

## DOCKERIZE

```bash
docker build -t lala-bear -f ./docker/Dockerfile .

# interactive mode
docker run -it -p 3000:3000 lala-bear

# deploy mode
docker run -d -p 3000:3000 lala-bear

```


## NEXTJS
```bash
npx create-next-app@latest my-threejs-nextjs --typescript
cd my-threejs-nextjs

npm install three @react-three/drei @react-three/fiber @types/three
```

```bash
# install dependencies
npm install
#run app
npm run dev
```

