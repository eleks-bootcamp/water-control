import React, {useState} from 'react';
import {DoughnutChart} from "./DoughnutChart";
import {useOutletContext} from "react-router-dom";
import moment from "moment";
import style from './Analytics.module.css'
import AnalyticsParams from "./AnalyticsParams";
import {addDays} from "date-fns";
import {LineChart} from "./LineChart";
import {dateFormate, dateToDate, dateToMonth} from '../../helpers/utils'

const calculateWater = (key, curUser) => {
  return curUser.historyOfDrunkWater ? curUser.historyOfDrunkWater[key]
      ? Object.values(curUser.historyOfDrunkWater[key]).reduce(
        (a, b) => a + b,
        0
      )
      : 0
    : 0
}

const Analytics = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const key = 'selection'

  const handleChange = (data) => {
    setStartDate(data[key].startDate);
    setEndDate(data[key].endDate);
  }

  const {dbUser} = useOutletContext();

  const today = moment().format("MM-DD-YYYY");
  const yesterday = moment().subtract(1, 'days').format("MM-DD-YYYY")

  const waterForDay = dbUser.userWeight * 30
  const drunkToday = calculateWater(today, dbUser)
  const remainder = waterForDay - drunkToday

  const drunkYesterday = calculateWater(yesterday, dbUser)
  const remainderYesterday = waterForDay - drunkYesterday

  const todayDate = startDate.toDateString() === new Date().toDateString() && endDate.toDateString() === new Date().toDateString()
  const yesterdayDate = startDate.toDateString() === addDays(new Date(), -1).toDateString() && endDate.toDateString() === addDays(new Date(), -1).toDateString()

  let drunk, left

  if (todayDate) {
    drunk = drunkToday
    left = remainder
  } else if (yesterdayDate) {
    drunk = drunkYesterday
    left = remainderYesterday
  }

  const difTime = Math.abs(new Date(endDate) - new Date(startDate))
  const difDay = Math.ceil(difTime / (1000 * 60 * 60 * 24))

  let drunkHistory = []
  let labels = []

  if (Object.keys(dbUser).length > 0) {
    if (difDay >= 60) {
      let monthSum = 0
      for (let d = 0; d <= difDay; d++) {
        const newDate = addDays(startDate, d)
        const water = calculateWater(dateFormate(newDate), dbUser)
        const dayAfter = addDays(newDate, 1)
        if (newDate.getMonth() !== dayAfter.getMonth()) {
          drunkHistory.push(monthSum + water)
          monthSum = 0
          labels.push(dateToMonth(newDate))
        } else {
          monthSum += water
        }
      }
      drunkHistory.push(monthSum)
      labels.push(dateToMonth(endDate))
    } else {
      for (let d = 0; d <= difDay; d++) {
        const newDate = addDays(startDate, d)
        const water = calculateWater(dateFormate(newDate), dbUser)
        drunkHistory.push(water)
        labels.push(dateToDate(newDate))
      }
    }
  }
  return (
    <div className={style.analytics}>
      <h1 className={style.analytics_title}>Analytics</h1>
      <div className={style.wrapper}>
        <div className={style.calendar}>
          <AnalyticsParams startDate={startDate} endDate={endDate} handleChange={handleChange}/>
        </div>
        <div className={todayDate || yesterdayDate ? style.analytics_donat : style.analytics_line}>
          {
            todayDate || yesterdayDate
              ? <div className={style.donut_chart}><DoughnutChart drunk={drunk} left={left}/></div>
              : drunkHistory.length ?
                <div className={style.line_chart}><LineChart drunkHistory={drunkHistory} labels={labels}/></div> : <></>
          }
        </div>
      </div>
    </div>
  )
};

export default Analytics;
