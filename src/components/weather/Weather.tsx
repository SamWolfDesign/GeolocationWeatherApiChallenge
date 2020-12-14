import React from 'react';

type AcceptedProps = {
    optionalProp?: string;
};

type WeatherState = {
    loc: {
    lat: number | string | undefined;
    lon: number | string | undefined;
    };
    city: string;
    tempC: number | string;
    tempF: number | string;
    icon: any;
    sunrise: any;
    sunset: any;
    errorMessage: string;
};


const key: string = 'AIzaSyCe5XWdJdmiqciV0Jge0TGTlSGBzxik0j8';

class Weather extends React.Component<AcceptedProps, WeatherState> {
constructor(props: AcceptedProps) {
    super(props);
    this.state = {
    loc: {
        lat: 0,
        lon: 0,
    },
    city: 'City Unknown',
    tempC: 0,
    tempF: 0,
    icon: undefined,
    sunrise: undefined,
    sunset: undefined,
    errorMessage: `Hey. Don't freak out or anything, but uh, we can't find you.`,
    };
}

getPosition: any = () => {
    return new Promise((resolve: any, reject: any) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

getWeather = async (lat: number, lon: number) => {
    
    const api_call = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
    );
    const data = await api_call.json();
    
    this.setState({
    loc: {
        lat: 0,
        lon: 0,
    },
    city: data.name,
    tempC: Math.round(data.main.temp),
      tempF: Math.round(data.main.temp * 1.8 + 32),
    icon: data.weather[0].icon,
    sunrise: undefined,
    sunset: undefined,
    errorMessage: `Ooh yeah, no. Looks like you don't have your location enabled. You should probably fix that!`,
    });
};



success(pos: any){
    let cord: any = pos.coords;
    console.log(`Your current position is: ${cord.latitude} , ${cord.longitude} (spooky, right??)`)
}

error(err: any){
    console.warn(`ERROR(${err.code}): ${err.message}`)
}

componentDidMount() {
let options = {
    enableHighAcuraacy: true,
    timeout: 5000,
    maximumAge: 0
}
    if('geolocation' in navigator){

    navigator.geolocation.getCurrentPosition(this.success, this.error, options)
    } else {
    console.log('No worky 4 me :(')
    }
    
    this.getPosition()
    .then((position: any) => {
        this.getWeather(position.coords.latitude, position.coords.longitude);
    })
    .catch((err: any) => {
        this.setState({ errorMessage: err.message });
    });
}

render() {
    
    const { city, tempC, tempF, icon } = this.state;
    return (
    <div className="Weather">
        <div className="weather-container">
        <div>{city}</div>
        <div className="weather-item">
            {tempC} &deg;C <span className="slash">/</span>
            {tempF} &deg;F
        </div>
        <div>
            <img
            className="weather-icon"
            src={`http://openweathermap.org/img/w/${icon}.png`}
            alt="weather icon"
            />
        </div>
        </div>
    </div>
    );
}
}

export default Weather;