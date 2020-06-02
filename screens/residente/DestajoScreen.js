import React, { Component } from 'react';
import { View, StyleSheet, Alert, FlatList, Text, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import CustomButton from '../../components/CustomButton';
import { Icon } from 'react-native-elements';
import { Divider } from 'react-native-elements';
import { AvenirBook, AvenirHeavy, AvenirMedium } from '../../components/StyledText';
import URLBase from '../../constants/URLBase';
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderGrayBack } from '../../components/Headers';
import ReporteItemCheckBox from '../../components/ReporteItemCheckBox';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-native-datepicker';
import moment from "moment";
 
const meses = ['ene','feb','mar', 'abr', 'may','jun','jul', 'ago', 'sep', 'oct','nov', 'dic'];

export default class DestajoScreen extends Component {
    constructor(props) {
        super(props);
        let hoy = new Date();
        let today = hoy.getDay();
        let lunes = '';
        let domingo = '';
        const { title } = this.props.navigation.state.params;

        switch (today) {
            case 0:
                lunes = moment(hoy).subtract(6, 'd').format('DD-MMM-YYYY');
                domingo = moment(hoy).format('DD-MMM-YYYY');
                break;
            case 1:
                lunes = moment(hoy).format('DD-MMM-YYYY');
                domingo = moment(hoy).add(6, 'd').format('DD-MMM-YYYY');
                break;
            case 2:
                lunes = moment(hoy).subtract(1, 'd').format('DD-MMM-YYYY');
                domingo = moment(hoy).add(5, 'd').format('DD-MMM-YYYY');
                break;
            case 3:
                lunes = moment(hoy).subtract(2, 'd').format('DD-MMM-YYYY');
                domingo = moment(hoy).add(4, 'd').format('DD-MMM-YYYY');
                break;
            case 4:
                lunes = moment(hoy).subtract(3, 'd').format('DD-MMM-YYYY');
                domingo = moment(hoy).add(3, 'd').format('DD-MMM-YYYY');
                break;
            case 5:
                lunes = moment(hoy).subtract(4, 'd').format('DD-MMM-YYYY');
                domingo = moment(hoy).add(2, 'd').format('DD-MMM-YYYY');
                break;
            case 6:
                lunes = moment(hoy).subtract(5, 'd').format('DD-MMM-YYYY');
                domingo = moment(hoy).add(1, 'd').format('DD-MMM-YYYY');
                break;
        }

        this.state = {
            categorias: [],
            nombre: '',
            formatFechaInicio: '',
            formatFechaFin: '',
            categoria: 'Destajos',
            isLoading: true,
            errorNombre: false,
            errorUnidad: false,
            errorPrecioUnidad: false,
            showAlertEdit: false,
            showAlertDelete: false,
            loadingReporte: false,
            checkedListaSemanal: false,
            checkedDestajistas: false,
            checkedOtrosGastos: false,
            errorGastoSemanal: false,
            editable: null,
            title: title,
            fecha_inicio: lunes,
            fecha_fin: domingo,
        };
    }

    componentDidMount(){
        this.getDatos();
        this.getGastos();
    }

    formatDate(fecha){
        let arrayFecha = fecha.split('-');
        newDate = moment(new Date(arrayFecha[2], meses.indexOf(arrayFecha[1]), arrayFecha[0])).format("YYYY-MM-DD");
        return newDate;
    }

    getDatos(){
        let costos_dest = [];
        let costos_otros = [];
        let unidades_add = [];

        var formData = new FormData();
        const { accessInfo} = this.props.screenProps; 
        const { idProyecto } = this.props.navigation.state.params;

        formData.append('user_id', accessInfo.user.id);
        formData.append('id_proyecto', idProyecto);
        formData.append('categoria_sel', this.state.categoria);

        fetch(URLBase + '/res/regresaDatosAutocompletables', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR JSON DATOS *********************');
                console.log(responseJson.costos_dest); 

                _costos_dest = responseJson.costos_dest;
                _costos_otros = responseJson.costos_otros;
                _unidades = responseJson.unidades;
                proveedores_dest = responseJson.proveedores_dest;
                proveedores_otros = responseJson.proveedores_otros;

                _costos_dest.forEach((element) => {
                    costos_dest.push({ id: element.id, nombre: element.nombre, name: element.nombre + ', $'+ element.pu + ', ' + element.unidad, value: element.nombre, pu: element.pu, unidad: element.unidad , proveedor: element.provedor, notas: element.notas, categoria_id: element.categorias_id});           
                });
                _costos_otros.forEach((element) => {
                    costos_otros.push({ id: element.id, nombre: element.nombre, name: element.nombre + ', $'+ element.pu + ', ' + element.unidad, value: element.nombre, pu: element.pu, unidad: element.unidad , proveedor: element.provedor, notas: element.notas, categoria_id: element.categorias_id});           
                });
                _unidades.forEach( element => {
                    unidades_add.push({ name: element });
                });

                this.setState({
                    costos_dest,
                    costos_otros,
                    unidades_add,
                    proveedores_dest,
                    proveedores_otros
                });
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
    }

    getGastos = async () => {
        let cuadrillas = [];
        let destajos;
        let mano_de_obra;
        let proveedores;
        let otros_gastos;
        let total_destajos = 0;
        let total_otros_gastos = 0;
        let total_mano_obra = 0;

        var formData = new FormData();

        const { idProyecto } = this.props.navigation.state.params;
        const { accessInfo } = this.props.screenProps;
        const { fecha_inicio, fecha_fin } = this.state;

        formData.append('idProyecto', idProyecto);
        formData.append('fecha_inicio', this.formatDate(fecha_inicio)),
        formData.append('fecha_fin',this.formatDate(fecha_fin));

        fetch(URLBase + '/res/getGastos', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success && responseJson.success == '200'){
                    console.log("Respuesta GASTOOS");
                    //console.log(responseJson);
                    _cuadrillas = responseJson.cuadrillas;
                    mano_de_obra = responseJson.manodeobra;
                    destajos = responseJson.destajos;
                    otros_gastos = responseJson.otros;
                    proveedores = responseJson.proveedores;

                    _cuadrillas.forEach(element => {
                        cuadrillas.push({id: element.id, nombre: element.nombre, name: element.nombre})
                    });

                    mano_de_obra.forEach(mano_de_obra => {
                        mano_de_obra.costos.forEach(costo => {
                            total_mano_obra += parseFloat(costo.asistencias.length * costo.pu);
                        })
                    });

                    destajos.forEach(destajo => {
                        destajo.costos.forEach(costo => { 
                            costo.gasto.forEach(gasto => {
                                total_destajos += parseFloat(gasto.total);
                            })                           
                        })                 
                    });

                    otros_gastos.forEach(otro_gasto => {
                        otro_gasto.costos.forEach(costo => {
                            costo.gasto.forEach(gasto => {
                                total_otros_gastos += parseFloat(gasto.total);
                            })
                        })
                    });

                    cuadrillas.push(({ id: 0, nombre: null , name: null}));
                    proveedores.push(({ id: 0, nombre: null }));
                    
                    this.setState({
                        proveedores,
                        cuadrillas,
                        destajos,
                        otros_gastos,
                        mano_de_obra,
                        total_destajos,
                        total_otros_gastos,
                        total_mano_obra,
                        costos: responseJson.costos,
                        categorias: responseJson.categorias,
                        isLoading: false
                    })
                } else{
                    console.log(responseJson);
                    Alert.alert('Error', 'No se han podido consultar los gastos');
                }
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
    }

    eliminarDestajo() {
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        const { editable, categoria, fecha_inicio, fecha_fin } = this.state;

        formData.append('id', editable.id);
        formData.append('categoria', categoria);
        formData.append('fecha_inicio', this.formatDate(fecha_inicio));
        formData.append('fecha_fin', this.formatDate(fecha_fin));

        fetch(URLBase + '/res/eliminarDestajos', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('Respuesta Eliminar Destajo ***********');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                   /*let nuevosDestajos = this.state.destajos.filter(element => element.id != editable.id);
                   let total_destajos = 0;
                    if (nuevosDestajos.lenght !== 0) {
                        nuevosDestajos.forEach((element) => {
                            total_destajos = total_destajos + parseFloat(element.total_destajos);
                        });
                    }*/
                   this.setState({
                        showAlertDelete: true,
                        isLoading: true,
                   });
                } else
                    Alert.alert('No se ha podido eliminar el destajo', responseJson.message);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    createReporte = async () => {
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        const { idProyecto } = this.props.navigation.state.params;
        const { fecha_inicio, fecha_fin, checkedDestajistas, checkedListaSemanal, checkedOtrosGastos } = this.state;

        formData.append('id', idProyecto);
        formData.append('fecha_inicio', this.formatDate(fecha_inicio));
        formData.append('fecha_fin', this.formatDate(fecha_fin));
        formData.append('semanal', checkedListaSemanal);
        formData.append('destajista', checkedDestajistas);
        formData.append('otros_gastos', checkedOtrosGastos);

        fetch(URLBase + '/res/gastoSemanal', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('Respuesta::: ***********');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '300') {
                    this.setState({loadingReporte: false});
                    Linking.openURL(responseJson.ruta).catch((err) => console.error('An error occurred', err));
                } else {
                    Alert.alert('Error', 'No se pudo generar el reporte');
                    this.setState({ loadingReporte: false });
                } 
            })
            .catch((error) => {
                console.error(error);
            });
    }

    _keyExtractor = (item, index) => item.id.toString();

    _renderDatosGasto(item, categoria, costos){
        let total; 
        let costo;
        const ancho = '20%';

        if(categoria != "Mano de obra"){
            costos.forEach( element => {
                if(element.id == item.item.costos_id)
                    costo = element;
            })
            uno = costo.nombre;
            dos = item.item.cantidad;
            tres = costo.unidad;
            cuatro = costo.pu;
            total = item.item.total;  
        } else {
            uno = item.item.nombre;
            dos = item.item.puesto;
            tres = item.item.asistencias.length;
            cuatro = item.item.pu;
            total = item.item.asistencias.length * item.item.pu;
        }

        return(
            <TouchableOpacity
                onPress={() =>
                    this.setState({
                        showAlertEdit: true,
                        editable: item.item,
                        costo_editable: costo,
                        item: item.item.nombre,
                        categoria: categoria
                    })
                } 
                style={styles.rowCategoriaContainer}>
                <AvenirMedium style={[styles.textGray, {width: ancho}]}>
                    {uno}
                </AvenirMedium>
                <AvenirMedium style={[styles.textGray, {width: ancho}]}>
                    {dos}
                </AvenirMedium>
                <AvenirMedium style={[styles.textGray, {width: ancho}]}>
                    {tres}
                </AvenirMedium>
                <AvenirMedium style={[styles.textGray, {width: ancho}]}>
                    <NumberFormat
                        value={parseFloat(cuatro).toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                        renderText={value => <Text>{value}</Text>}
                    />
                </AvenirMedium>
                <AvenirMedium style={[styles.textGray, {width: ancho}]}>
                    <NumberFormat
                        value={parseFloat(Math.round(total)).toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                        renderText={value => <Text>{value}</Text>}
                    />
                </AvenirMedium>
            </TouchableOpacity>
        )
    }

    calcula_total(categoria, identificador, gastos){
        let total = 0;

        if(gastos != undefined || gastos != null){
            gastos.forEach((gasto) => {
                if(categoria == "Mano de obra") {
                    if(identificador == 0){
                        if(gasto.grupo_id == null)
                            total += parseFloat(gasto.asistencias.length * gasto.pu);
                    }
                    if (gasto.grupo_id == identificador)
                        total += parseFloat(gasto.asistencias.length * gasto.pu);
                }
                if(categoria == "Destajos"){
                    if(gasto.provedor == identificador)
                        total += parseFloat(gasto.total);
                } 
            })
        }
        return parseFloat(total).toFixed(2);
    }

    _renderTabla( item, categoria ){
        let data = [];
        let costos = [];
        const ancho = '20%';

        if(categoria != "Mano de obra"){
            uno = 'Concepto';
            dos = 'Cant.';
            tres = 'Unidad';

            if(categoria == "Destajos")
                datos = this.state.destajos;
            else    
                datos = this.state.otros_gastos;
        } else {
            uno = 'Nombre';
            dos = 'Puesto';
            tres = 'Asistencias';
            datos = this.state.mano_de_obra;
        }

        datos.forEach((element) => {
            element.costos.forEach((costo) => {
                if(categoria == "Mano de obra") {
                    costos = element.costos;
                    identificador = item.item.id;

                    if(costo.grupo_id == item.item.id)
                        data.push(costo);
                }
                if(categoria == "Destajos"){
                    identificador = item.item.nombre;

                    if(costo.provedor == item.item.nombre){
                        costos = element.costos;
                        gastos = costo.gasto;

                        gastos.forEach(gasto => {
                            data.push(gasto);
                        });
                    }
                } 
                if(categoria == "Otros gastos"){
                    identificador = null;
                    costos = element.costos;
                    gastos = costo.gasto;

                    gastos.forEach(gasto => {
                        data.push(gasto);
                    });
                } 
            })
        })

        if(data.length > 0){
            return(
                <View>
                    { categoria == "Otros gastos"
                        ? null
                        :   item.item.nombre != null
                            ?   <AvenirHeavy style={{fontSize: 16, marginBottom: 10}}> { item.item.nombre } </AvenirHeavy>
                            :   categoria == "Destajos"
                                ?   <AvenirHeavy style={{fontSize: 16, marginBottom: 10}}> Sin Proveedor </AvenirHeavy>
                                :   <AvenirHeavy style={{fontSize: 16, marginBottom: 10}}> Sin Cuartilla </AvenirHeavy>
                    }
                    <View style={styles.rowCategoriaContainer}>
                        <AvenirHeavy style={[styles.text, {width: ancho}]}>
                            {uno}
                        </AvenirHeavy>
                        <AvenirHeavy style={[styles.text, {width: ancho}]}>
                            {dos}
                        </AvenirHeavy>
                        <AvenirHeavy style={[styles.text, {width: ancho}]}>
                            {tres} 
                        </AvenirHeavy>
                        <AvenirHeavy style={[styles.text, {width: ancho}]}>
                            Precio Unit.
                        </AvenirHeavy>
                        <AvenirHeavy style={[styles.text, {width: ancho}]}>
                            Importe
                        </AvenirHeavy>
                    </View>
                    <FlatList
                        data={data}
                        keyExtractor = {this._keyExtractor}
                        renderItem={(item) => this._renderDatosGasto(item, categoria, costos)}
                    />
                    { categoria == "Otros gastos"
                        ?   null
                        :   <View>                    
                                <Divider style={{ backgroundColor: Colors.divisor, marginVertical: 10 }} />
                                <View style={styles.totalContainer}>
                                    <AvenirHeavy style={{ fontSize: 12 }}>
                                        Total: 
                                        <NumberFormat
                                            value={parseFloat(Math.round(this.calcula_total(categoria, identificador, data))).toFixed(2)}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={' $'}
                                            renderText={value => <Text>{value}</Text>}
                                        />
                                    </AvenirHeavy>
                                </View>
                            </View>
                    }
                    <Divider style={{ backgroundColor: Colors.divisor, marginVertical: 10 }} />
                </View>
            )
        }
    }

    _renderEncabezadoTablaGastos = ({ item }) => {
        let data = [];
        let totalTabla = 0;
        let categoria = item.value;

        if(categoria == "Mano de obra"){
            totalTabla = this.state.total_mano_obra;
            data = this.state.cuadrillas;
        }
        if(categoria == "Destajos"){
            totalTabla = this.state.total_destajos;
            data = this.state.proveedores;
        }
        if(categoria == "Otros gastos"){
            totalTabla = this.state.total_otros_gastos;
            data.push(({ id: 0, nombre: 'prueba' }));
        }

        return(
            <View style={styles.tableStyle}>
                <View style={[SharedStyles.categoriaContainer,{padding: 5}]}>
                    <AvenirHeavy style={{textAlign: 'center', fontSize: 16, marginBottom: 10}}> {categoria + ' >'} </AvenirHeavy>
                    <FlatList
                        data = { data }
                        keyExtractor = {this._keyExtractor}
                        renderItem = {(item) => this._renderTabla(item, categoria)}
                    />
                    <Divider style={{ backgroundColor: Colors.divisor, marginVertical: 10 }} />
                    <View style={styles.totalContainer}>
                        <AvenirHeavy style={{ fontSize: 12 }}>
                            Sub total: 
                            <NumberFormat
                                value={parseFloat(Math.round(totalTabla)).toFixed(2)}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={' $'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        </AvenirHeavy>
                    </View>
                </View>
            </View>
        )
    };
    
    render() {
        const { accessInfo } = this.props.screenProps;
        const { idProyecto } = this.props.navigation.state.params;
        const total = this.state.total_mano_obra + this.state.total_destajos + this.state.total_otros_gastos;

        return (
            <View style={styles.fatherContainer}>
                <View style={[SharedStyles.container]}>
                    <HeaderGrayBack
                        title={this.state.title}
                        action={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                    <ScrollView style={ styles.container }>
                        <View style={[SharedStyles.categoriaContainer, styles.inputContainer]}>
                            <AvenirHeavy style={ {marginRight: 10} }>
                                Fecha Inicio:
                            </AvenirHeavy>
                            <DatePicker
                                date={ this.state.fecha_inicio }
                                locale={'es'}
                                mode="date"
                                placeholder="Seleccione la fecha"
                                format="DD-MMM-YYYY"
                                minDate={'01-ene-1930'}
                                confirmBtnText="Confirmar"
                                cancelBtnText="Cancelar"
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        borderWidth: 0,
                                        margin: 0,
                                        padding: 0,
                                        alignItems: 'flex-start'
                                    },
                                    dateText: {
                                        fontFamily: 'avenir-book',
                                        color: Colors.subtitle,
                                    }
                                }}
                                onDateChange={(fecha_inicio) => {
                                    this.setState({ fecha_inicio, fecha_fin: '',errorFechaFin: '', errorGastoSemanal: false })
                                }}
                            />
                        </View>
                        <View style={[SharedStyles.categoriaContainer, styles.inputContainer]}>
                            <AvenirHeavy style={{ marginRight: 10 }}>
                                Fecha Fin: 
                            </AvenirHeavy>
                            <DatePicker
                                date = {this.state.fecha_fin}
                                locale = {'es'}
                                mode = "date"
                                placeholder = {'Seleccione la fecha'}
                                format = "DD-MMM-YYYY"
                                minDate = {'01-ene-1930'}
                                confirmBtnText = "Confirmar"
                                cancelBtnText = "Cancelar"
                                showIcon = {false}
                                customStyles = {{
                                    dateInput: {
                                        borderWidth: 0,
                                        margin: 0,
                                        padding: 0,
                                        alignItems: 'flex-start'
                                    },
                                    dateText: {
                                        fontFamily: 'avenir-book',
                                        color: Colors.subtitle,
                                    }
                                }}
                                onDateChange={(fecha_fin) => {
                                    if(this.state.fecha_inicio == ''){
                                        this.setState({ errorFechaFin: 'vacio' })
                                    } else {
                                        let arrayFechaFin = fecha_fin.split('-');
                                        let arrayFechaInico = this.state.fecha_inicio.split('-');
                                        let formatFechaFin = moment(new Date(arrayFechaFin[2], meses.indexOf(arrayFechaFin[1]), arrayFechaFin[0])).format("YYYY-MM-DD");
                                        console.log('Nueva fecha fin : ', formatFechaFin);
                                        let formatFechaInicio = moment(new Date(arrayFechaInico[2], meses.indexOf(arrayFechaInico[1]), arrayFechaInico[0])).format("YYYY-MM-DD");
                                        console.log('Nueva fecha inicio : ', formatFechaInicio);
                                        if (formatFechaFin >= formatFechaInicio) {
                                            this.setState({ 
                                                fecha_fin, 
                                                formatFechaInicio,
                                                formatFechaFin,
                                                errorFechaFin: '', 
                                                errorGastoSemanal: false, 
                                                isLoading: true,
                                                }, function(){
                                                    this.getGastos();
                                                })
                                        } else 
                                            this.setState({ errorFechaFin: 'menor', fecha_fin: '' })
                                    } 
                                }}
                            />
                        </View>
                        { this.state.errorFechaFin == 'vacio' 
                            ?   <AvenirBook style={styles.error}>Seleccione primero la Fecha de Inicio</AvenirBook>
                            :   this.state.errorFechaFin == 'menor' ? <AvenirBook style={{ marginHorizontal: 20, color: 'red', fontSize: 12 }}>Seleccione una fecha mayor o igual a la Fecha de Inicio</AvenirBook> : null
                        }
                        <View style={{ height: 20 }} />
                        <ReporteItemCheckBox
                            title='Lista Semanal'
                            checked={this.state.checkedListaSemanal}
                            onPress={() => this.setState({ errorGastoSemanal: false, checkedListaSemanal: !this.state.checkedListaSemanal })}
                        />
                        <View style={{ height: 20 }} />
                        <ReporteItemCheckBox
                            title='Destajistas'
                            checked={this.state.checkedDestajistas}
                            onPress={() => this.setState({ errorGastoSemanal: false, checkedDestajistas: !this.state.checkedDestajistas })}
                        />
                        <View style={{ height: 20 }} />
                        <ReporteItemCheckBox
                            title='Otros gastos'
                            checked={this.state.checkedOtrosGastos}
                            onPress={() => this.setState({ errorGastoSemanal: false, checkedOtrosGastos: !this.state.checkedOtrosGastos })}
                        />
                        <CustomButton
                            style={{ marginVertical: 20, marginHorizontal: 20 }}
                            title='Generar Gasto Semanal'
                            fontSize={14}
                            loading={this.state.loadingReporte}
                            onPress={() => {
                                if(this.state.loadingReporte == false){
                                    if (this.state.fecha_inicio == '' && this.state.fecha_fin == '') {
                                        this.setState({
                                            errorGastoSemanal: true
                                        });
                                    } else{
                                        if (this.state.checkedListaSemanal == false && this.state.checkedDestajistas == false && this.state.checkedOtrosGastos == false) {
                                            this.setState({
                                                errorGastoSemanal: true
                                            });
                                        }  else {
                                            this.setState({
                                                loadingReporte: true,
                                            });
                                            this.createReporte();
                                        }
                                    }                      
                                }
                            }} 
                        />
                        { this.state.errorGastoSemanal == true ? <AvenirBook style={styles.error}>Seleccione al menos una opción para generar el Gasto Semanal, así como la fecha de inicio y fin</AvenirBook> : null}
                        <Divider style={styles.divisorStyle} />
                        { this.state.isLoading == true 
                            ?   <ActivityIndicator size="large" color={Colors.primary} />
                            :   <View style={{ paddingVertical: 20}}>
                                    <FlatList
                                        horizontal = {true}
                                        data = {this.state.categorias}
                                        keyExtractor = {this._keyExtractor}
                                        renderItem = {this._renderEncabezadoTablaGastos}
                                    />
                                </View>
                        }
                        <View style = {{ height: 45 }} />
                    </ScrollView>
                    <View style={{alignItems:'center'}}>
                        <AvenirHeavy style={{ marginBottom: 10 }}>
                            Total: 
                            <NumberFormat
                                value={parseFloat(Math.round(total)).toFixed(2)}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={' $'}
                                renderText={total => <Text>{total}</Text>}
                            />
                        </AvenirHeavy>
                    </View>
                    
                </View>
                <TouchableOpacity
                    style={ styles.addContainer }
                    onPress = {() => {
                        this.props.navigation.navigate('AddDestajo', { 
                            categorias: this.state.categorias,
                            idProyecto: idProyecto, 
                            accessInfo: accessInfo,
                            categoria: this.state.categoria,
                            costos_dest: this.state.costos_dest,
                            costos_otros: this.state.costos_otros,
                            unidades: this.state.unidades_add,
                            _categorias: this.state.categorias,
                            proveedores_dest: this.state.proveedores_dest,
                            proveedores_otros: this.state.proveedores_otros,
                            getGastos: this.getGastos.bind(this),
                        });
                    }}>
                    <Icon
                        name='plus'
                        type='antdesign'
                        size={24}
                        color={Colors.white}
                    />
                </TouchableOpacity>
                <AwesomeAlert
                    titleStyle={SharedStyles.titleStyle}
                    messageStyle={SharedStyles.messageStyle}
                    confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                    show={this.state.showAlertEdit}
                    title={this.state.item}
                    message={'Seleccione la acción a realizar'}
                    closeOnTouchOutside={true}
                    showConfirmButton={true}
                    showCancelButton={true}
                    confirmText='Eliminar'
                    cancelText='Editar'
                    closeOnHardwareBackPress={false}
                    confirmButtonColor={Colors.primary}
                    cancelButtonColor={Colors.title}
                    onCancelPressed={() => {
                        this.setState({
                            showAlertEdit: false
                        });
                        if(this.state.categoria != "Mano de obra"){
                            this.props.navigation.navigate('AddDestajo', {
                                idProyecto: idProyecto,
                                accessInfo: accessInfo,
                                editable: this.state.editable,
                                categoria: this.state.categoria,
                                costo_editable: this.state.costo_editable,
                                costos_dest: this.state.costos_dest,
                                costos_otros: this.state.costos_otros,
                                unidades: this.state.unidades_add,
                                _categorias: this.state.categorias,
                                proveedores_dest: this.state.proveedores_dest,
                                proveedores_otros: this.state.proveedores_otros,
                                getGastos: this.getGastos.bind(this),
                            });
                        } else {
                            this.props.navigation.navigate('EditarObrero', { 
                                idProyecto: idProyecto, 
                                accessInfo: accessInfo,
                                item: this.state.editable,
                                categoria: this.state.categoria,
                                categorias: this.state.categorias,
                                cuadrillas: this.state.cuadrillas,
                                getGastos: this.getGastos.bind(this)
                            });
                        }
                    }}
                    onConfirmPressed={() => {
                        this.setState({
                            showAlertEdit: false
                        });
                        this.eliminarDestajo();
                        this.getGastos();
                    }}
                    onDismiss={() => {
                        this.setState({
                            showAlertEdit: false
                        });
                    }}
                />
                <AwesomeAlert
                    titleStyle={SharedStyles.titleStyle}
                    messageStyle={SharedStyles.messageStyle}
                    confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                    show={this.state.showAlertDelete}
                    title={'Eliminado'}
                    message={'El dato ha sido eliminado'}
                    closeOnTouchOutside={true}
                    showConfirmButton={true}
                    confirmText='Aceptar'
                    closeOnHardwareBackPress={false}
                    confirmButtonColor={Colors.primary}
                    cancelButtonColor={Colors.title}
                    onConfirmPressed={() => {
                        this.setState({
                            showAlertDelete: false
                        });
                    }}
                />            
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 20,
        marginHorizontal: 20,
        padding: 0,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    error: {
        fontSize: 12,
        color: 'red',
        marginBottom: 20,
        marginHorizontal: 20,
        textAlign: 'center'
    },
    fatherContainer: {
        flex: 1,
        backgroundColor: Colors.background
    },
    title: {
        fontSize: 16,
        textAlign: 'center',
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
    },
    textGray: {
        fontSize: 12,
        color: Colors.subtitle,
        textAlign: 'center',
    },
    totalContainer: {
        alignItems: 'flex-end',
        marginBottom: 5
    },
    divisorStyle: {
        backgroundColor: Colors.divisor,
        marginHorizontal: 20
    },
    addContainer: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.title
    },
    rowCategoriaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    tableStyle:{
        width: 360, 
        marginHorizontal: 5, 
        paddingBottom: 5,
    }
});