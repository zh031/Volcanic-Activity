# This script is going to leverage weather, seismic, and previous volcanic 
# activities to predict future volcanic activities or eruptions in Guatemala

####################### LOADING DATA ########################################

library(readxl)
path = "/Users/hanzuel/Documents/GitHub/Volcanic-Activity"
setwd("/Users/hanzuel/Documents/GitHub/Volcanic-Activity")
EruptionHistory = read_xlsx(file.path(path,"GuatemalaVolcano.xlsx"), sheet = "EruptionHistory")
# Asks data structure of EruptionHistory
str(EruptionHistory)

# extracts VEI data from EruptionHistory and converts data to a factor format
EruptionHistory$VEI = factor(EruptionHistory$VEI)
View(EruptionHistory)
EruptionHistory$Volcano = factor(EruptionHistory$Volcano)

# opening all sheets
FuegoWeather = read_xlsx(file.path(path,"WeatherData.xlsx"), sheet = "Fuego")
PacayaWeather = read_xlsx(file.path(path,"WeatherData.xlsx"), sheet = "Pacaya")
AcatenangoWeather = read_xlsx(file.path(path,"WeatherData.xlsx"), sheet = "Acatenango")

# opening libraries
library(caret)
library(dplyr)
library(lubridate)
library(randomForest)

# modifies date format
FuegoWeather$Date = as.Date(as.character(FuegoWeather$Date), format = "%Y%m%d")

#combines time with date (creates a new column)
FuegoWeather$DateTime = as.POSIXct(paste(FuegoWeather$Date, FuegoWeather$Time_24h), format = "%Y-%m-%d %H")
FuegoWeather$EruptionStarted = as.factor(FuegoWeather$EruptionStarted)
FuegoWeather$Condition = as.factor(FuegoWeather$Condition)

# Split data into training and testing set 
set.seed(123)

# using 80% of data to train the machine learning (checking model mechanism) 
trainIndex = createDataPartition(FuegoWeather$EruptionStarted, p = 0.8, list = FALSE)
trainData = FuegoWeather[trainIndex, ]
# the minus sign uses the left 20% to test
testData = FuegoWeather[-trainIndex, ]

set.seed(123)
#creating a random forest model in 5 fold data (creating model mechanism)
model = train(EruptionStarted ~ ., data = trainData, method = "rf",
              trControl = trainControl(method = "cv", number = 5), importance = TRUE)

print(model)
#testing
predictions = predict(model, newData = testData)
#identify if accurate ( compares with real output )
confusionMatrix(predictions, testData$EruptionStarted)
varImp(model)
saveRDS(model, "eruption_prediction_model.rds")

# changes Condition data to numerical data
# states that inside data condition there are different categories or levels
FuegoWeather$Condition = factor(FuegoWeather$Condition, 
                                levels = c("Fair", "LightDrizzle", "Drizzle", "LightRain",
                                           "Thunder", "Cloudy", "Partly Cloudy", "MostlyCloudy")
                                )

########################### DATA VISUALIZATION ################################

library(ggplot2)
# fills missing values of column with Volcano data
ggplot(EruptionHistory,aes(x = VEI, fill = Volcano)) + 
  geom_bar(position = "dodge", color = "black") + 
  # creates a separate plot (chart) for each volcano data type
  facet_wrap(~ Volcano, scales = "free_y") + 
  labs(
    title = "VEI Distribution by Volcano",
    x = "Volcanic Explosivity Index (VEI)",
    y = "Count"
  ) + 
  theme_minimal()

########################### MACHINE LEARNING ##################################

# first approach : logistic regression
# collects data from columns 4 to 11
model = glm(FuegoWeather$EruptionStarted ~ .,data = FuegoWeather[,4:11], family = binomial)
summary(model)

# second approach : random Forest
FuegoWeather = na.omit(FuegoWeather)
library(randomForest)
rFmodel = randomForest(FuegoWeather$EruptionStarted ~ .,data = FuegoWeather[,4:11])
print(rFmodel)

# imports usgsEarthqake data 
earthquakeData = read.csv("earthquake.csv")

# making the support vector machine (svm) 
library(e1071)
class(earthquakeData$time)
earthquakeData$type = factor(earthquakeData$type)
earthquakeData$magType = factor(earthquakeData$magType)
earthquakeData$net = factor(earthquakeData$net)

# from format character to time
earthquakeData$time = as.POSIXct(earthquakeData$time, format = "%Y-%m-%dT%H:%M:%OSZ", tz = "UTC")
earthquakeData$time = as.numeric(difftime(earthquakeData$time, reference_time, unit = "days"))
# separating format of data one by one 
earthquakeData$Year <- as.numeric(format(earthquakeData$Time, "%Y"))
earthquakeData$Month <- as.numeric(format(earthquakeData$Time, "%m"))
earthquakeData$Day <- as.numeric(format(earthquakeData$Time, "%d"))
earthquakeData$Hour <- as.numeric(format(earthquakeData$Time, "%H"))
earthquakeData$Minute <- as.numeric(format(earthquakeData$Time, "%M"))
earthquakeData$Second <- as.numeric(format(earthquakeData$Time, "%S"))
model_svm = svm(time~latitude + longitude + depth + mag + magType + nst + gap + dmin  +
                  updated + place + type + horizontalError + depthError + magError + magNst +status + 
                  locationSource + magSource, data = earthquakeData, type = "eps-regression", kernel = "radial")
# predicts what date earthquake will happen through lat and long 
model_time = svm(time~ latitude + longitude, data = earthquakeData, type = "eps-regression", kernel = "radial")
