import React, { useState, useContext, useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import TableSelecCategory from "../TableSelect/TableSelecCategory";
import TableSelecSubCategory from "../TableSelect/TableSelecSubCategory";
import TableSelecFamily from "../TableSelect/TableSelecFamily";
import TableSelecSubFamily from "../TableSelect/TableSelecSubFamily";
import TableSelecProductNML from "../TableSelect/TableSelecProductNML";

const BoxFamilias = ({ onSelect }) => {
  const { userData, addToSalesData } = useContext(SelectedOptionsContext);

  const [category, setCategory] = useState(null);
  const [categoryId, setCategoryId] = useState(0);
  const [showCategory, setShowCategory] = useState(false);

  const [subcategory, setSubcategory] = useState(null);
  const [subcategoryId, setSubcategoryId] = useState(0);
  const [showSubcategory, setShowSubcategory] = useState(false);

  const [family, setFamily] = useState(null);
  const [familyId, setFamilyId] = useState(0);
  const [showFamily, setShowFamily] = useState(false);

  const [subfamily, setSubfamily] = useState(null);
  const [subfamilyId, setSubfamilyId] = useState(0);
  const [showSubfamily, setShowSubfamily] = useState(false);

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [showProduct, setShowProduct] = useState(false);

  const [recorrido, setRecorrido] = useState("");

  useEffect(() => {
    // Resetea todos los valores al montar el componente
    setCategory(null);
    setSubcategory(null);
    setFamily(null);
    setSubfamily(null);
    setProduct(null);

    setRecorrido("");

    setCategoryId(0);
    setSubcategoryId(0);
    setFamilyId(0);
    setSubfamilyId(0);

    setShowCategory(true);
    setShowSubcategory(false);
    setShowFamily(false);
    setShowSubfamily(false);
    setShowProduct(false);
  }, []);

  const handleSelectCategory = (category) => {
    setCategory(category);
    setCategoryId(category.idCategoria);
    setRecorrido("/" + category.descripcion);
    setShowCategory(false);
    setShowSubcategory(true);
  };

  const handleSelectSubCategory = (subcategory) => {
    setSubcategory(subcategory);
    setSubcategoryId(subcategory.idSubcategoria);
    setRecorrido("/" + category.descripcion + "/" + subcategory.descripcion);
    setShowFamily(true);
    setShowSubcategory(false);
  };

  const handleSelectfamily = (family) => {
    setFamily(family);
    setFamilyId(family.idFamilia);
    setRecorrido("/" + category.descripcion + "/" + subcategory.descripcion + "/" + family.descripcion);
    setShowSubfamily(true);
    setShowFamily(false);
  };

  const handleOnNotSubcategoriesFound = () => {
    console.log("no encontró subcategorías");
    setShowProduct(true);
    setShowSubcategory(false);
    setRecorrido("/" + category.descripcion);
  };

  const handleOnNotFamiliesFound = () => {
    console.log("no encontró familias");
    setShowProduct(true);
    setShowFamily(false);
    setRecorrido("/" + category.descripcion + "/" + subcategory.descripcion);
  };

  const handleOnNotSubfamiliesFound = () => {
    console.log("no encontró subfamilias");
    setShowProduct(true);
    setShowSubfamily(false);
    setRecorrido("/" + category.descripcion + "/" + subcategory.descripcion + "/" + family.descripcion);
  };

  const handleSelectSubfamily = (subfamily) => {
    setSubfamily(subfamily);
    setSubfamilyId(subfamily.idSubFamilia);
    setRecorrido(
      "/" +
        category.descripcion +
        "/" +
        subcategory.descripcion +
        "/" +
        family.descripcion +
        "/" +
        subfamily.descripcion
    );
    setShowProduct(true);
    setShowSubfamily(false);
  };

  const handleSelectProduct = (product) => {
    onSelect(product);
  };

  const handlePrevClick = () => {
    if (showSubcategory) {
      setShowSubcategory(false);
      setShowCategory(true);
      setRecorrido("");
    } else if (showFamily) {
      setShowFamily(false);
      setShowSubcategory(true);
      setRecorrido("/" + category.descripcion);
    } else if (showSubfamily) {
      setShowSubfamily(false);
      setShowFamily(true);
      setRecorrido("/" + category.descripcion + "/" + subcategory.descripcion);
    } else if (showProduct) {
      if (subfamilyId) {
        setShowSubfamily(true);
        setShowProduct(false);
        setRecorrido("/" + category.descripcion + "/" + subcategory.descripcion + "/" + family.descripcion);
      } else if (familyId) {
        setShowFamily(true);
        setShowProduct(false);
        setRecorrido("/" + category.descripcion + "/" + subcategory.descripcion);
      } else if (subcategoryId) {
        console.log("tiene subcategoría");
        setShowSubcategory(true);
        setShowProduct(false);
        setRecorrido("/" + category.descripcion);
      } else {
        setRecorrido("");
        setShowCategory(true);
        setShowProduct(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TableSelecCategory
        show={showCategory}
        onSelect={handleSelectCategory}
      />

      <TableSelecSubCategory
        title={"Elegir subcategoría para '" + recorrido + "'"}
        show={showSubcategory}
        categoryId={categoryId}
        onSelect={handleSelectSubCategory}
        onNotSubcategoriesFound={handleOnNotSubcategoriesFound}
      />

      <TableSelecFamily
        title={"Elegir familia para '" + recorrido + "'"}
        show={showFamily}
        categoryId={categoryId}
        subcategoryId={subcategoryId}
        onSelect={handleSelectfamily}
        onNotFamiliesFound={handleOnNotFamiliesFound}
      />

      <TableSelecSubFamily
        title={"Elegir subfamilia para '" + recorrido + "'"}
        show={showSubfamily}
        categoryId={categoryId}
        subcategoryId={subcategoryId}
        familyId={familyId}
        onSelect={handleSelectSubfamily}
        onNotSubfamiliesFound={handleOnNotSubfamiliesFound}
      />

      <TableSelecProductNML
        title={"Elegir producto para '" + recorrido + "'"}
        show={showProduct}
        categoryId={categoryId}
        subcategoryId={subcategoryId}
        familyId={familyId}
        subfamilyId={subfamilyId}
        onSelect={handleSelectProduct}
        excludeIfText={["AGREGA", "SIN"]}
      />

      {!showCategory && (
        <View style={styles.buttonContainer}>
          <Button title="Previo" onPress={handlePrevClick} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    
  },
});

export default BoxFamilias;
