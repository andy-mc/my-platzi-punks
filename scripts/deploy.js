async function deploy() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contract with the account:", deployer.address);

  const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
  const platzi_punks = await PlatziPunks.deploy();
  await platzi_punks.deployed();

  console.log("Platzi Punks is deployed at:", platzi_punks.address);
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
