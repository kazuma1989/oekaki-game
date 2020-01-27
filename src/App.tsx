import { useState, useEffect } from '/web_modules/preact/hooks.js'
import OpeningView from './OpeningView.js'
import GameView from './GameView.js'
import CanvasView from './CanvasView.js'
import ResultView from './ResultView.js'

export default function App() {
  const [viewMode, setViewMode] = useState<
    'opening' | 'game' | 'canvas' | 'result'
  >('opening')
  const showResult = () => setViewMode('result')
  const closeResult = () => setViewMode('game')
  const startDrawing = () => setViewMode('canvas')

  const [tutorial, setTutorial] = useState(false)
  const startGame = () => {
    setTutorial(false)
    setViewMode('game')
  }
  const startTutorial = () => {
    setTutorial(true)
    setViewMode('game')
  }

  const [questionState, setQuestionState] = useState<
    'drawing' | 'passed' | 'correct'
  >('drawing')
  const [passCount, setPassCount] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const passQuestion = () => {
    setViewMode('game')
    setQuestionState('passed')
    setPassCount(v => v + 1)
  }
  const correctQuestion = () => {
    setViewMode('game')
    setQuestionState('correct')
    setCorrectCount(v => v + 1)
  }
  const goToNextQuestion = () => setQuestionState('drawing')

  const resetGame = () => {
    setViewMode('opening')
    setQuestionState('drawing')
    setPassCount(0)
    setCorrectCount(0)
  }

  const [rawQuestions, setRawQuestions] = useState<
    | {
        mainText: string
        subText: string
        forTutorial: boolean
        disabled: boolean
      }[]
    | null
  >(null)
  const questions = rawQuestions
    ? rawQuestions
        .filter(q => q.forTutorial === tutorial)
        .map(({ mainText, subText }) => ({ mainText, subText }))
    : []
  const loading = rawQuestions === null
  const loadQuestions = async () => {
    setRawQuestions(null)

    const sheetValues = await fetchSheetValues()
    const parsed = sheetValues
      .slice(1)
      .map(([mainText, subText, forTutorial, disabled]) => ({
        mainText: mainText as string,
        subText: subText as string,
        forTutorial: Boolean(forTutorial),
        disabled: Boolean(disabled),
      }))
      .filter(
        ({ mainText, subText, disabled }) => !disabled && (mainText || subText),
      )

    setRawQuestions(shuffle(parsed))
  }
  useEffect(() => {
    loadQuestions()
  }, [])

  switch (viewMode) {
    case 'opening':
      return (
        <OpeningView
          loading={loading}
          onReload={loadQuestions}
          onStartTutorial={startTutorial}
          onStartGame={startGame}
        />
      )

    case 'game':
      return (
        <GameView
          questions={questions}
          questionState={questionState}
          passCount={passCount}
          correctCount={correctCount}
          onStartDrawing={startDrawing}
          onNextQuestion={goToNextQuestion}
          onShowResult={showResult}
        />
      )

    case 'canvas':
      return (
        <CanvasView
          onPassQuestion={passQuestion}
          onCorrectQuestion={correctQuestion}
        />
      )

    case 'result':
      return (
        <ResultView
          passCount={passCount}
          correctCount={correctCount}
          onClose={closeResult}
          onReset={resetGame}
        />
      )

    default:
      const _: never = viewMode
      return <div>ERROR</div>
  }
}

function fetchSheetValues() {
  return new Promise<(string | boolean)[][]>((resolve, reject) => {
    if ('google' in window) {
      const { google } = window as any
      const timerId = setTimeout(reject, 5000)

      google.script.run
        .withSuccessHandler(values => {
          resolve(values)
          clearTimeout(timerId)
        })
        .getValues()
    } else {
      // const stubData = [
      //   ['ヘッダー', '', '', ''],
      //   ['チュートリアル 1', '', true, ''],
      //   ['チュートリアル 2', '', true, ''],
      //   ['チュートリアル 3', '', true, ''],
      //   ['ドラえもん', '', '', ''],
      //   ['プーさん', '', '', ''],
      //   ['キティちゃん', '', '', ''],
      //   ['ミッキーマウス', 'みんなのお友達だよ!!!ハハッ!!', '', ''],
      // ]

      setTimeout(() => resolve(p), 1000)
    }
  })
}

// https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
function shuffle<T>(array: T[]): T[] {
  const target = [...array]

  for (let i = target.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = target[i]
    target[i] = target[j]
    target[j] = temp
  }

  return target
}

// FIXME ベタがきデータ
const data = `
なす		TRUE	
カリフラワー		TRUE	
トマト		TRUE	
大根		TRUE	
とうもろこし			
白菜			
しいたけ			
もやし			
かいわれ			
キャベツ			
レタス			
じゃがいも			
きゅうり			
にんじん			
エリンギ			
ブロッコリー			
れんこん			
玉ねぎ			
アボカド			
			
			
ドラえもん			
プーさん			
カールのおじさん			
カーネルサンダース	ケンタッキーのマスコット		
ミッキーマウス			
ハローキティ			
スヌーピー			
ウルトラマン			
セーラームーン			
ピカチュウ			
桃太郎			
浦島太郎			
			
救急車			
消防車			
パトカー			
新幹線			
メリーゴーランド			
自転車			
			
ゾウ			
キリン			
イヌ			
ネコ			
ライオン			
			
スフィンクス			
タージマハル	インドの有名な建物		
東京タワー			
スカイツリー			
ハチ公			
東京ドーム			
太陽の塔			
			
イチロー			
ヤワラちゃん			
安倍首相			
桐谷美玲			
聖徳太子			
ザビエル			
ピコ太郎	PPAPの人		
タモリ			
			
縄文時代			
爆買い			
少子化			
人口ピラミッド			
YouTuber			
心頭滅却	すれば火もまた涼し		
三つ子			
ミラーボール			
ケバブ			
液晶テレビ			
生放送			
ガスボンベ			
クレーマー			
SNS炎上			
アンケート			
本能寺の変			
バタフライエフェクト			
シークレットブーツ			
知覚過敏			
USBメモリ			
ミジンコ			
峰打ち			
ビールサーバー			
プロジェクションマッピング			
吊り橋効果			
フラクタル図形			
3Dプリンター			
スマートスピーカー	「アレクサ」など具体的な製品名でも正解		
ドリフト走行			
蛇足			
死亡フラグ			
ロールシャッハテスト	性格検査のひとつ		TRUE
ワゴンセール			
マッドサイエンティスト			
麻酔銃			
テレパシー			
デフォルメ			
ハッピーエンド			
バッドエンド			
卒塔婆	そとば。お墓に立っているあれ		
テトラポッド			
帽子屋			
反則			
デッサン			
鉄道撮影家	「鉄オタ」「撮り鉄」でも正解		
しゃっくり			
`

const p = data
  .split('\n')
  .map(v => v.trim())
  .filter(Boolean)
  .map(v => v.split(/\s/g))

console.log(p)
