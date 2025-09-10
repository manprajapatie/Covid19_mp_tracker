import { useEffect, useState } from 'react'
import './App.css'
import { MenuItem, FormControl, Select, Card, CardContent } from "@mui/material"
import InfoBox from './InfoBox'
import Map from './Map'

function App() {

  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(["Worldwide"])
  const [countryInfo, setCountryInfo] = useState([])

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => { setCountryInfo(data) })
  })

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "Worldwide" ?
        "https://disease.sh/v3/covid-19/all" :
        `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      }
      )
  }

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((countryData) => ({
            name: countryData.country, // Country full name like India Japan
            value: countryData.countryInfo.iso2 // Country code name like In Ja
          }))
          setCountries(countries)
        })

    }
    getCountriesData()
  },
    [])

  return (
    <>
      <div className='app'>

        <div className="app__left">
          <div className="app__header">
            <h1>Covid 19 Tracker</h1>
            <FormControl className='app__dropdown'>
              <Select
                variant="outlined"
                value={country}
                onChange={onCountryChange}
              >

                <MenuItem value="Worldwide"> Worldwide </MenuItem>


                {/* Loop THrough all the contries and then show dropdown */}

                {
                  countries.map((country) => (
                    <MenuItem value={country.value}> {country.name} </MenuItem>
                  ))
                }

                {/* <MenuItem value="worldWide"> worldWide 1</MenuItem>
              
              <MenuItem value="worldWide"> worldWide 3</MenuItem>
              <MenuItem value="worldWide"> worldWide 4</MenuItem> */}


              </Select>
            </FormControl>
          </div>


          <div className="app__stats">
            {/* Infomation boxes */}
            <InfoBox title="CoronaVirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
            <InfoBox title="Recovered" cases={countryInfo.todayRecovery} total={countryInfo.recovered} />
            <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
          </div>



          <Map />
        </div>

        <Card className="app__right">
          <CardContent>
            <h3> Live Cases by country</h3>
            {/* Table */}
            <h3>Worldwide new cases</h3>
            {/* Graph */}
          </CardContent>


        </Card>

      </div>

    </>
  )
}

export default App
