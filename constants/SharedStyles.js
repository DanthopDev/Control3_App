import React, { Component } from 'react';
import { Platform } from 'react-native';
import Colors from '../constants/Colors';
import { StyleSheet } from 'react-native';

export default SharedStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    titleStyle: {
        fontFamily: 'avenir-heavy',
        color: Colors.title
    },
    messageStyle: {
        fontFamily: 'avenir-book',
        color: Colors.subtitle,
        textAlign: 'center',
        lineHeight: 18 
    },
    confirmButtonTextStyle: {
        color: Colors.title,
    },
    progressBarContainer: {
        marginVertical: 3
    },
    progresosContainer: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 10,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowRadius: 3,
                shadowOffset: { height: 5 },
                shadowOpacity: 0.1,
            },
            android: {
                elevation: 5,
            },
        })
    },
    progressTitle: {
        marginBottom: 4,
        fontSize: 12
    },
    progressBarBackground: {
        backgroundColor: Colors.title,
        borderRadius: 10
    },
    textProgress: {
        marginTop: 5,
        textAlign: 'center',
        color: '#5c5c5c',
        fontSize: 10
    },
    itemDescriptionText:{ 
        fontSize: 13, 
        fontFamily: 'avenir-book', 
        color: Colors.placeholder 
    },
    itemProyectoContainer: {
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        borderRadius: 5,
        padding: 10,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowRadius: 3,
                shadowOffset: { height: 5 },
                shadowOpacity: 0.1,
            },
            android: {
                elevation: 3,
            },
        })
    },
    hitoDescriptionContainer: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowRadius: 3,
                shadowOffset: { height: 5 },
                shadowOpacity: 0.1,
            },
            android: {
                elevation: 3,
            },
        })
    },
    nameHitoContainer: {
        marginBottom: 5
    },
    desgloseHitoContainer: {
        marginTop: 10
    },
    infoTitle: {
        color: Colors.title
    },
    infoValor: {
        color: Colors.subtitle
    },
    textPrecio: {
        fontSize: 16
    },
    gastos: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textGray: {
        fontSize: 12,
        color: Colors.subtitle
    },
    totalContainer: {
        marginTop: 10,
        alignItems: 'flex-end'
    },
    rowCategoriaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    gastoTotalContainer: {
        backgroundColor: Colors.title,
        borderRadius: 5,
        width: '48%',
        padding: 10,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowRadius: 3,
                shadowOffset: { height: 5 },
                shadowOpacity: 0.1,
            },
            android: {
                elevation: 3,
            },
        })
    },
    presupuestoContainer: {
        backgroundColor: Colors.white,
        borderRadius: 5,
        width: '48%',
        padding: 10,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowRadius: 3,
                shadowOffset: { height: 5 },
                shadowOpacity: 0.1,
            },
            android: {
                elevation: 3,
            },
        })
    },
    categoriaContainer: {
        backgroundColor: Colors.white,
        borderRadius: 5,
        padding: 10,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowRadius: 3,
                shadowOffset: { height: 5 },
                shadowOpacity: 0.1,
            },
            android: {
                elevation: 3,
            },
        })
    },
    textLabel: {
        fontSize: 12,
        color: Colors.title,
        marginLeft: 10,
        marginTop: 20
    },
    autoItemTextStyle: {
        color: Colors.title,
        fontFamily: 'avenir-medium',
        fontSize: 16
    },
    autoItemStyle: {
        padding: 5,
        marginTop: 2,

    },
    autoInputStyle: {
        paddingLeft: 10,
        padding: 5,
        width: '100%',
        color: Colors.gray,
        fontSize: 16,
        fontFamily: 'avenir-medium',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});