import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Snackbar,
  Modal,
  Provider,
  Portal, Title
} from "react-native-paper";

export default function Main() {

    const [visibleModal, setVisibleModal] = React.useState(false);

    const showModal = () => setVisibleModal(true);
    const hideModal = () => setVisibleModal(false);


  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [nombreError, setNombreError] = useState("");
  const [apellidoPaternoError, setApellidoPaternoError] = useState("");
  const [identificacionError, setIdentificacionError] = useState("");
  const [botonHabilitado, setBotonHabilitado] = useState(false);


  const validarNombre = () => {
    if (nombre.trim() === "") {
      setNombreError("El nombre no puede estar vacío");
    } else {
      setNombreError("");
    }
  };

  const validarApellidoPaterno = () => {
    if (apellidoPaterno.trim() === "") {
      setApellidoPaternoError("El apellido paterno no puede estar vacío");
    } else {
      setApellidoPaternoError("");
    }
  };

  const validarIdentificacion = () => {
        if (identificacion.trim() === "") {
          setIdentificacionError("La identificación no puede estar vacía");
        } else if (!/^\d+$/.test(identificacion)) {
          setIdentificacionError(
            "La identificación debe contener solo números"
          );
        } else {
          setIdentificacionError("");
        }
  };

  
  useEffect(() => {
    validarNombre();
  }, [nombre]);

  useEffect(() => {
    validarApellidoPaterno();
  }, [apellidoPaterno]);

  useEffect(() => {
    validarIdentificacion();
  }, [identificacion]);

  useEffect(() => {
    const hayErrores =
      nombreError !== "" ||
      apellidoPaternoError !== "" ||
      identificacionError !== "";
    setBotonHabilitado(!hayErrores);
  }, [nombreError, apellidoPaternoError, identificacionError]);

  const agregarPersona = () => {
    const url = "http://localhost:8080/api/agregar-persona";
    const data = {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      identificacion,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); 
        onToggleSnackBar();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

   const [personas, setPersonas] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/personas');
        const data = await response.json();
        setPersonas(data); 
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData(); 
  }, []);


  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Image style={styles.image} source={require("./assets/pxfuel.jpg")} />

        <View style={styles.footer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Registro de usuario</Text>
        <Text style={styles.subtitle}>
          Esta es la pantalla cliente que recibe una API para el registro de
          usuarios
        </Text>

        <Portal>
          <Modal
            visible={visibleModal}
            onDismiss={hideModal}
            style={styles.containerStyle}
          >
          <Title>
            Lista de personas
          </Title>
            {personas.map((persona, index) => (
              <View key={index}>
                <Text>Nombre: {persona.nombre}</Text>
                <Text>Apellido Paterno: {persona.apellidoPaterno}</Text>
                <Text>Apellido Materno: {persona.apellidoMaterno}</Text>
                <Text>Identificación: {persona.identificacion}</Text>
                <Text>Facturas:</Text>
                {persona.facturas.map((factura, facturaIndex) => (
                  <View key={facturaIndex}>
                    <Text>      Id factura {factura.id}:</Text>
                     <Text>     Fecha: {factura.fecha}</Text>
                     <Text>     Monto: {factura.monto}</Text>
                  </View>
                ))}
                <Text>-------------------------</Text>
              </View>
            ))}
          </Modal>
        </Portal>
        <Button style={styles.personas} onPress={showModal}>
          Ver personas
        </Button>

        <TextInput
          style={styles.input}
          mode="outlined"
          label="Nombre"
          onBlur={validarNombre}
          onChangeText={setNombre}
          value={nombre}
        />
        {nombreError !== "" && (
          <Text style={styles.errorText}>{nombreError}</Text>
        )}
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Apellido paterno"
          onBlur={validarApellidoPaterno}
          onChangeText={setApellidoPaterno}
          value={apellidoPaterno}
        />
        {apellidoPaternoError !== "" && (
          <Text style={styles.errorText}>{apellidoPaternoError}</Text>
        )}
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Apellido materno"
          onChangeText={setApellidoMaterno}
          value={apellidoMaterno}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Identificación"
          keyboardType="numeric"
          onBlur={validarIdentificacion}
          onChangeText={setIdentificacion}
          value={identificacion}
        />
        {identificacionError !== "" && (
          <Text style={styles.errorText}>{identificacionError}</Text>
        )}

        <Button
          disabled={!botonHabilitado}
          mode="contained"
          onPress={agregarPersona}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Registrar</Text>
        </Button>
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Cerrar",
            onPress: () => {
            },
          }}
        >
          Persona registrada con éxito
        </Snackbar>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    flex: 1,
  },
  content: {
    padding: 30,
    paddingTop: 0,
    height: "55%",
    backgroundColor: "#fff",
  },
  title: {
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 22,
  },
  subtitle: {
    fontSize: 15,
    color: "gray",
    textAlign: "center",
    marginVertical: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  input: {
    marginVertical: 7,
  },
  button: {
    marginVertical: 7,
    marginHorizontal: 40,
    height: "12%",
    justifyContent: "center",
    marginTop: 15,
  },
  buttonText: {
    fontSize: 18,
  },
  errorText: {
    color: "red",
    fontSize:13,
    position: "relative",
    marginVertical:-7
  },
  personas: {
    marginVertical: -20,
  },
  containerStyle: {
    backgroundColor: "white",
    paddingHorizontal: 40,
    borderRadius: 20,
    height: "80%",
    
  }
});
