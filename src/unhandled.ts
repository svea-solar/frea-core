type Init = () => void;

let initialized = false;

export const init: Init = () => {
  if (initialized) {
    throw new Error("The unhandled util has already been initialized.");
  }

  initialized = true;

  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception.");
    console.error(error);
    process.exit(100);
  });

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled rejection.");
    console.error(error);
    process.exit(101);
  });
};
