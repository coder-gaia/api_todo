import app from './app';

const PORT = process.env.PORT ?? 3333;

app.listen(Number(PORT), () => {
  console.log(`Server listening on port ${PORT}`);
});
