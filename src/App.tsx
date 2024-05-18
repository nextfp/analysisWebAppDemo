import { useState, useEffect } from "react";
import "./App.css";
import carImg from "/public/car.png";
import { Card } from "./components/ui/card";

let sendeddata = {
  vector: [0, 0, 90],
  speed: 50,
  rotate: -40,
  pedal: [0, 0],
  rpm: 0,
};

function moveCar(vector: number[]) {
  let returnVector = [...vector]; // 新しい配列を作成
  const centerX = 250; // 円の中心のX座標
  const centerY = 250; // 円の中心のY座標
  const radius = 200; // 円の半径

  // 現在の角度を計算
  const currentAngle = (vector[2] * Math.PI) / 180;

  // X座標を計算
  const newX = centerX + radius * Math.cos(currentAngle);

  // Y座標を計算
  const newY = centerY + radius * Math.sin(currentAngle);

  // 新しい座標を設定
  returnVector[0] = newX;
  returnVector[1] = newY;

  // 角度を更新
  returnVector[2] -= 1;
  if (newX < 250) {
    returnVector[2] -= 1;
  }

  // 角度が360度を超えた場合は0度に戻す
  if (returnVector[2] <= -360) {
    returnVector[2] = 0;
  }

  return returnVector;
}

function speadCheck(x: number) {
  if (x < 250) {
    return 80;
  } else {
    return 50;
  }
}

function pedalCheck(vector: number[]) {
  if (vector[0] < 250) {
    return [10, 80];
  } else {
    return [10, 50];
  }
}

function makedata(data: typeof sendeddata) {
  data.vector = moveCar(data.vector);
  data.speed = speadCheck(data.vector[0]);
  data.pedal = pedalCheck(data.vector);
  data.rpm = data.speed * 80;
  return data;
}

function App() {
  // input 要素に入力された値
  const [inputVal, setInputVal] = useState([0, 0, 90]);
  const [speed, setspeed] = useState("50km");
  const [rotate, setRotate] = useState(0);
  const [pedal, setPedal] = useState([0, 0]);
  const [rpm, setRpm] = useState(0);
  // setInterval の中で整形された文字列
  // マウント時にのみ実行される useEffect
  useEffect(() => {
    // 定期実行で input 要素に入力された値を外部に渡す
    const intervalId = setInterval(() => {
      sendeddata = makedata(sendeddata);
      setInputVal(sendeddata.vector);
      setspeed(sendeddata.speed + "km");
      setRpm(sendeddata.rpm);
      setRotate(sendeddata.rotate);
      setPedal(sendeddata.pedal);
    }, 30);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* setInterval 内で作った文字列を表示 */}
      <Card className="flex gap-6 items-stretch p-2">
        <div className="flex flex-col gap-3">
          <div>
            {Math.floor(Math.floor(inputVal[0] * 10) / 10)},
            {Math.floor(inputVal[1] * 10) / 10}
          </div>
          <Card>{speed}</Card>
          <Card>
            <img
              className="mx-auto"
              style={{
                transform: `rotate(${rotate}deg)`,
                transformOrigin: "center center",
                width: "100px",
              }}
              src="https://nextfp.github.io/note/cdn/SteeringWheel.png"
              alt=""
            />
          </Card>
        </div>
        <Card className="flex flex-col p-2">
          <div className="flex gap-10 items-end mt-auto">
            <div>
              <div
                className="bg-red-500 mx-auto"
                style={{
                  width: "50px",
                  height: `${pedal[0]}px`,
                }}
              />
              <p>ブレーキ{pedal[0]}%</p>
            </div>
            <div>
              <div
                className="bg-blue-500 mx-auto"
                style={{
                  width: "50px",
                  height: `${pedal[1]}px`,
                }}
              />
              <p>アクセル{pedal[1]}%</p>
            </div>
          </div>
        </Card>
        <Card className="flex p-2">
          <div className=" w-[140px] self-end">
            <div className="relative flex aspect-[2] items-center justify-center overflow-hidden rounded-t-full bg-blue-400">
              <div
                className={`absolute top-0 aspect-square w-full bg-gradient-to-tr from-transparent from-50% to-white to-50% transition-transform duration-500`}
                style={{ transform: `rotate(${(rpm / 10000) * 180}deg)` }}
              ></div>
              <div className="absolute top-1/4 flex aspect-square w-3/4 justify-center rounded-full bg-blue-100"></div>
              <div className="absolute bottom-0 w-full truncate text-center leading-none">
                {rpm}rpm
              </div>
            </div>
          </div>
        </Card>
      </Card>
      <Card className="h-[500px]">
        <img
          src={carImg}
          alt="car"
          style={{
            width: "50px",
            height: "50px",
            transform: `translateX(${inputVal[0]}px) translateY(${inputVal[1]}px) rotate(${inputVal[2]}deg)`,
          }}
        />
      </Card>
    </div>
  );
}

export default App;
