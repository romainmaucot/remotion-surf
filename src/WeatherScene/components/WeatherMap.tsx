import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { useGetWeatherData } from '../../api/useGetWeatherData';
import { DisplayType } from '../interface';
import { Temperature } from './Temperature';
import { useTranslate } from './useTranslate';
import { transformLatToMapTopPosition, transformLongToMapLeftPosition } from './utils';
import { WeatherIcon } from './WeatherIcon';
import { WeatherMapBackground } from './WeatherMapBackground';

const ICON_SIZE = 85;

interface Props {
    className?: string;
    displayType: DisplayType;
}

export const WeatherMap: FunctionComponent<Props> = ({ className, displayType }) => {
    const {
        minimalEveningTemperature,
        maximalEveningTemperature,
        minimalMorningTemperature,
        maximalMorningTemperature,
        weatherDataByCity,
    } = useGetWeatherData();

    const translateX = useTranslate({
        from: -1000,
        to: 0,
    });

    return (
        <Container className={className} $translateX={translateX}>
            <CitiesContainer $displayType={displayType}>
                {weatherDataByCity.map((city, index) => {
                    const top = transformLatToMapTopPosition(city.lat);
                    const left = transformLongToMapLeftPosition(city.lon);
                    if (displayType === DisplayType.FORECAST) {
                        return (
                            <StyledWeatherIcon
                                key={index}
                                $top={top}
                                $left={left}
                                icon={city.weathers[1].weatherIcon}
                            />
                        );
                    }
                    const temperature =
                        displayType === DisplayType.MORNING_TEMPERATURE
                            ? city.weathers[1].temperature.morning
                            : city.weathers[1].temperature.evening;
                    const minTemperature =
                        displayType === DisplayType.MORNING_TEMPERATURE
                            ? minimalMorningTemperature
                            : minimalEveningTemperature;
                    const maxTemperature =
                        displayType === DisplayType.MORNING_TEMPERATURE
                            ? maximalMorningTemperature
                            : maximalEveningTemperature;
                    return (
                        <StyledTemperature
                            key={index}
                            $top={top}
                            $left={left}
                            temperature={temperature}
                            minimalTemperature={minTemperature}
                            maximalTemperature={maxTemperature}
                        />
                    );
                })}
            </CitiesContainer>
            <WeatherMapBackground />
        </Container>
    );
};

const Container = styled.div<{ $translateX: number }>`
    height: 650%;
    width: 650%;
    display: flex;
    margin-top: -135%;
    position: absolute;
    transform: translateX(${({ $translateX }) => `${$translateX}px`});
`;

const CitiesContainer = styled.div<{ $displayType: DisplayType }>`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
`;

const StyledWeatherIcon = styled(WeatherIcon) <{ $top: number; $left: number }>`
    position: absolute;
    top: ${({ $top }) => $top - 1}%;
    left: ${({ $left }) => $left - 1}%;
    z-index: 2;
    height: ${ICON_SIZE}px;
    width: ${ICON_SIZE}px;
`;

const StyledTemperature = styled(Temperature) <{ $top: number; $left: number }>`
    position: absolute;
    z-index: 2;
    top: ${({ $top }) => $top}%;
    left: ${({ $left }) => $left + 1}%;
`;
