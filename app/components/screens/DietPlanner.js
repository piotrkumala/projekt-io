import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-elements';

import { getHost, getEmail, getToken } from '../ServerConnection';

const DietPlaner = props =>{
    const navigation = props.navigation;
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 2)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - currentDate.getDay());
    startDate.setHours(startDate.getHours() + 2)
    const endDate = new Date(Number(startDate));
    endDate.setDate(endDate.getDate() + 7);

    const daysOfTheWeek = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    const [data, setData] = useState(null);
    const [leftListData, setLeftListData] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');
    useEffect(()=>{
        const getData = async () =>{
            const res = await fetch(getHost() + '/meal/week',{
                headers:{
                    'x-access-token': getToken()
                }
            });
            const rawData = await res.json();
            const data = rawData.map(x=> {
                return {
                name: x.nazwa,
                calories: x.kalorie,
                count: x.ilość,
                day: x.dzien,
                dayTime: x.pora_dnia === 'o' ? 'Obiad' : x.pora_dnia === 's' ? 'Śniadanie' : x.pora_dnia === 'k' ? 'Kolacja' : 'Nieznana pora',
                id: x.porcja_id

            }}).sort((a,b)=>
                a.dayTime === 'Nieznana pora' && b.dayTime != 'Nieznana pora' ? 1 
                    : a.dayTime === 'Kolacja' && (b.dayTime != 'Nieznana pora' || b.dayTime != 'Kolacja') ? 1 
                    : a.dayTime === 'Obiad' && b.dayTime == 'Śniadanie'? 1
                    : a.dayTime === 'Śniadanie' && b.datTime != 'Śniadanie' ? -1 : 0
            );
            console.log(data)
            const leftData = daysOfTheWeek.map((x,i) => {
                const date = new Date(Number(startDate));
                date.setDate(date.getDate() + i);
                const dayItems = data.filter(item => item.day.split('T')[0] === date.toISOString().split('T')[0]);
                let cal = 0;
                console.log(date.toISOString().split('T')[0])
                dayItems.forEach(item =>{
                    cal += item.calories * item.count.split('g')[0]/100;
                })
                return {
                    calories: cal || 0,
                    day: x,
                    date: date
                }
            });
            setLeftListData(leftData);
            setData(data);
            setSelectedDay(startDate.toISOString().split('T')[0]);
        }
        getData();
    }, [])

    const leftListHandler = item =>{
        setSelectedDay(item.date.toISOString().split('T')[0]);
    }

    return (
        <View style = {styles.container}>
            <View style = {styles.column}>
                <View style = {styles.centered}>
                    <Icon
                        name='calendar'
                        type='font-awesome'                      
                        color = 'grey'
                    />
                </View>
                <FlatList
                    keyExtractor = {(item) => item.day}
                    extraData={selectedDay}
                    data={leftListData}
                    renderItem={({item}) => 
                    <TouchableOpacity style={styles.container} onPress = {()=>leftListHandler(item)} >
                    <Text style = {styles.item}>{item.day}</Text>
                    <Text style = {styles.item}>{item.calories}</Text>
                    </TouchableOpacity> }
                />
            </View>
            <View style = {styles.column}>
                <View style = {styles.centered}>
                    <Icon
                        name='list'
                        type='font-awesome'        
                        color = 'grey'

                    />
                </View>
                <FlatList
                    keyExtractor = {(item) => String(item.id)}
                    extraData = {selectedDay}
                    data={data != null && selectedDay != null ? data.filter(x=>x.day.split('T')[0] === selectedDay.split('T')[0]): []}
                    renderItem={ ({item}) =>
                    <View>    
                        <Text style={{alignSelf:'center'}}>{item.dayTime}:</Text>
                        <View style = {styles.container}>
                            <Text style = {styles.smallItem}>{item.name}</Text>
                            <Text style = {styles.smallItem}>{item.calories} kcal</Text>
                            <Text style = {styles.smallItem}>{item.count}</Text>
                        </View>
                    </View>}
                />
            </View>
        </View>
    )

}
const styles = StyleSheet.create({
    container:{
        margin:10,
        flexDirection: 'row'
    },
    column:{
        width: '50%',
        flexDirection:'column',
        height: '100%',
    },
    item:{
        width: '60%'
    },
    smallItem:{
        width: '40%'
    },
    centered:{
        alignSelf:'center',
        margin: 10
    }
  })

export default DietPlaner;


