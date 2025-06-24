import React, { useState, useEffect, useMemo, useRef } from "react";

import AsignarPeso from "../ScreenDialog/AsignarPeso";
import NewProductModal from './../../Modals/NewProductModal';

// import Confirm from "../Dialogs/Confirm";
// import Client from "../../Models/Client";
// import Alert from "../Dialogs/Alert";
// import Log from "../../Models/Log";
import IngresoPrecio from '../../Modals/IngresoPrecio';

export const ProviderModalesContext = React.createContext();

export const ProviderModales = ({ children }) => {
  //init configs values

  const [showAsignarPeso, setShowAsignarPeso] = useState(false)
  const [productoSinPeso, setProductoSinPeso] = useState(null)
  const [onConfirmAsignWeight, setonAsignWeight] = useState(null)

  const [showNuevoExpress, setShowNuevoExpress] = useState(false)
  const [codigoNuevoExpress, setCodigoNuevoExpress] = useState(0)
  const [handleNuevoProducto, setHandleGuardarNuevoProducto] = useState(null)


  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [textConfirm, setTextConfirm] = useState("")
  const [handleConfirm, setHandleConfirm] = useState(null)
  const [handleNotConfirm, setHandleNotConfirm] = useState(null)

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("")

  const [showAlertDialog, setShowAlert] = useState(false)
  const [titleMsg, setTitleMsg] = useState("")
  const [textMsg, setTextMsg] = useState("")

  const [showDialogSelectClientModal, setShowDialogSelectClientModal] = useState(false)
  const [clienteModal, setClienteModal] = useState(null)
  const [askLastSaleModal, setAskLastSaleModal] = useState(true)
  const [addToSalesDataModal, setAddToSalesDataModal] = useState(null)

  const [productoSinPrecio, setProductoSinPrecio] = useState(null);
  const [showAsignarPrecio, setShowAsignarPrecio] = useState(false);
  const [onAsignPrice, setOnAsignPrice] = useState(false);

  useEffect(() => {
    if (!showConfirmDialog) {
      setTextConfirm("")
    }
  }, [showConfirmDialog])

  useEffect(() => {
    if (!showAsignarPeso) {
      setProductoSinPeso(null)
    }
  }, [showAsignarPeso])

  useEffect(() => {
    if (!showAlertDialog) {
      setTextMsg("")
    }
  }, [showAlertDialog])

  const GeneralElements2 = () => {
    return (
      <>

        <AsignarPeso
          visible={showAsignarPeso}
          onClose={() => setShowAsignarPeso(false)}
          product={productoSinPeso}
          currentWeight={0}
          onSave={onConfirmAsignWeight}
        />

        {/* <Confirm
          openDialog={showConfirmDialog}
          setOpenDialog={setShowConfirmDialog}
          textConfirm={textConfirm}
          handleConfirm={handleConfirm}
          handleNotConfirm={handleNotConfirm}
        /> */}


        <NewProductModal
          visible={showNuevoExpress}
          pluCode={codigoNuevoExpress}
          onSave={handleNuevoProducto}
          onCancel={(e) => {
            if (!e) setCodigoNuevoExpress(0)
            setShowNuevoExpress(e)
          }}
          confirmation={true}
          confirmationMessage="Producto no encontrado. ¿Desea agregarlo?"
        />


        {/* <Snackbar
          open={openSnackbar}
          message={snackMessage}
          autoHideDuration={3000}
          onClose={() => {
            setOpenSnackbar(false)
            setSnackMessage("")
          }}
        />

        <Alert
          openDialog={showAlertDialog}
          setOpenDialog={setShowAlert}
          title={titleMsg}
          message={textMsg}
        /> */}

        <IngresoPrecio
          visible={showAsignarPrecio}
          product={productoSinPrecio}
          onConfirm={onAsignPrice}
          onCancel={() => {
            console.log("on cancel")
            setShowAsignarPrecio(false);
            setProductoSinPrecio(null);
          }}

        />



      </>
    )
  }

  return (
    <ProviderModalesContext.Provider
      value={{
        GeneralElements2,
        showAsignarPeso,
        setShowAsignarPeso,
        productoSinPeso,
        setProductoSinPeso,
        setonAsignWeight,
        onConfirmAsignWeight,

        setShowNuevoExpress,
        setCodigoNuevoExpress,
        setHandleGuardarNuevoProducto,
        codigoNuevoExpress,

        setShowConfirmDialog,
        textConfirm,
        setTextConfirm,
        setHandleConfirm,
        setHandleNotConfirm,

        setOpenSnackbar,
        snackMessage,
        setSnackMessage,

        setShowAlert,
        setTitleMsg,
        textMsg,
        setTextMsg,

        setShowDialogSelectClientModal,
        showDialogSelectClientModal,
        setClienteModal,
        clienteModal,
        setAskLastSaleModal,
        setAddToSalesDataModal,

        productoSinPrecio,
        setProductoSinPrecio,
        showAsignarPrecio,
        setShowAsignarPrecio,
        setOnAsignPrice,
      }}
    >
      {children}
    </ProviderModalesContext.Provider>
  );
};

export default ProviderModales;
