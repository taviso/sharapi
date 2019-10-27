function BeginFuzz()
{
    var Player = new Character();
    var Car;

    // We teleport the vehicle, so must be in a car.
    if (Player.IsInCar() == false) {
        console.log("Please enter a car first!");
        return;
    }

    // Wait a few seconds.
    Thread.sleep(5);

    // Find the current vehicle.
    Car = Player.GetVehicle();

    while (true) {

        // Choose a random map position.
        var Target = {
            x: -400 + Math.random() * 800,
            y: -1   + Math.random() * 800,
            z: -1   + Math.random() * 20,
        };

        // Reset coins
        CoinManager.AdjustBankValue(-CharacterSheetManager.GetNumberOfTokens());

        // Teleport Random Location
        Car.SetPosition(Target.x, Target.y, Target.z);

        // Spawn coins.
        CoinManager.SpawnInstantCoins(Target.x + Math.random() * 5,
                                      Target.y + Math.random() * 5,
                                      Target.z + Math.random() * 1,
                                      10);

        // Wait to collect them.
        Thread.sleep(0.5);

        // Log Result.
        console.log("Position", Car.GetPosition(), "Coins", CharacterSheetManager.GetNumberOfTokens());
    }
}

// Interceptors are buggy on Windows if you intercept functions called via NativeFunction()
//
// Interceptor.attach(Symbol.find("CoinManager::AdjustBankValue"), {
//    onEnter: function (args) {
//        console.log("CoinManager::AdjustBankValue() count=" + this.context.ecx.toInt32())
//    },
// });
