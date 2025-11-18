import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CronosTokenModule", (m) => {
  const counter = m.contract("CronosToken", ["Cronos Token", "CRT", "1000000000000000000000000"]);

  return { counter };
});
