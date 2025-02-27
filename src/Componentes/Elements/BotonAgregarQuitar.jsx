import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";
import AgregarQuitar from "../ScreenDialog/AgregarQuitar";


const BotonAgregarQuitar = ({
  product,
  style = {},
}) => {

  const [showModal, setShowModal] = useState(false)

  const [permitirAgregarYQuitarExtras, setpermitirAgregarYQuitarExtras] = useState(false)

  useEffect(() => {
    setpermitirAgregarYQuitarExtras(ModelConfig.get("permitirAgregarYQuitarExtras"))
  }, [])

  return !product.isEnvase && permitirAgregarYQuitarExtras ? (
    <>
      <AgregarQuitar
        openDialog={showModal}
        setOpenDialog={setShowModal}
        product={product}
      />
      <Button variant="outlined" sx={{
      }}
        onClick={() => {
          setShowModal(true)
        }}>
        A/Q
      </Button>
    </>
  ) : null
};

export default BotonAgregarQuitar;
