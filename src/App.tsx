import produce from '/web_modules/immer.js'
import { useReducer, useEffect } from '/web_modules/preact/hooks.js'
import OpeningView from './OpeningView.js'
import GameView from './GameView.js'
import CanvasView from './CanvasView.js'
import ResultView from './ResultView.js'

type State = {
  viewMode: 'opening' | 'game' | 'canvas' | 'result'
  tutorial: boolean

  questionState: 'drawing' | 'passed' | 'correct'
  passCount: number
  correctCount: number

  loading: boolean
  questions: {
    mainText: string
    subText: string
  }[]
  tutorialQuestions: {
    mainText: string
    subText: string
  }[]
}

type Action =
  | {
      type: 'showResult'
    }
  | {
      type: 'closeResult'
    }
  | {
      type: 'startDrawing'
    }
  | {
      type: 'startGame'
    }
  | {
      type: 'startTutorial'
    }
  | {
      type: 'passQuestion'
    }
  | {
      type: 'correctQuestion'
    }
  | {
      type: 'goToNextQuestion'
    }
  | {
      type: 'resetGame'
    }
  | {
      type: 'loadStart.sheetValues'
    }
  | {
      type: 'loadEnd.sheetValues'
      payload: {
        sheetValues: (string | boolean)[][]
      }
    }

const reducer = produce((state: State, action: Action) => {
  switch (action.type) {
    case 'showResult':
      state.viewMode = 'result'
      break

    case 'closeResult':
      state.viewMode = 'game'
      break

    case 'startDrawing':
      state.viewMode = 'canvas'
      break

    case 'startGame':
      state.tutorial = false
      state.viewMode = 'game'
      break

    case 'startTutorial':
      state.tutorial = true
      state.viewMode = 'game'
      break

    case 'passQuestion':
      state.viewMode = 'game'
      state.questionState = 'passed'
      state.passCount += 1
      break

    case 'correctQuestion':
      state.viewMode = 'game'
      state.questionState = 'correct'
      state.correctCount += 1
      break

    case 'goToNextQuestion':
      state.questionState = 'drawing'
      break

    case 'resetGame':
      state.viewMode = 'opening'
      state.questionState = 'drawing'
      state.passCount = 0
      state.correctCount = 0
      break

    case 'loadStart.sheetValues':
      state.loading = true
      break

    case 'loadEnd.sheetValues':
      const { sheetValues } = action.payload

      state.loading = false

      const parsed = sheetValues
        .slice(1)
        .map(([mainText, subText, forTutorial, disabled]) => {
          if (disabled || (!mainText && !subText)) {
            return null
          }

          return {
            mainText: mainText as string,
            subText: subText as string,
            forTutorial: Boolean(forTutorial),
          }
        })
        .filter(nonNull)

      state.questions = shuffle(parsed.filter(q => !q.forTutorial))
      state.tutorialQuestions = shuffle(parsed.filter(q => q.forTutorial))
      break

    default:
      const _: never = action
  }
})

export default function App() {
  const [
    {
      viewMode,
      tutorial,
      questionState,
      passCount,
      correctCount,
      loading,
      questions,
      tutorialQuestions,
    },
    dispatch,
  ] = useReducer<State, Action>(reducer, {
    viewMode: 'opening',
    tutorial: false,
    questionState: 'drawing',
    passCount: 0,
    correctCount: 0,
    loading: false,
    questions: [],
    tutorialQuestions: [],
  })

  const showResult = () => dispatch({ type: 'showResult' })
  const closeResult = () => dispatch({ type: 'closeResult' })
  const startDrawing = () => dispatch({ type: 'startDrawing' })

  const startGame = () => dispatch({ type: 'startGame' })
  const startTutorial = () => dispatch({ type: 'startTutorial' })

  const passQuestion = () => dispatch({ type: 'passQuestion' })
  const correctQuestion = () => dispatch({ type: 'correctQuestion' })
  const goToNextQuestion = () => dispatch({ type: 'goToNextQuestion' })

  const resetGame = () => dispatch({ type: 'resetGame' })

  const loadQuestions = async () => {
    dispatch({ type: 'loadStart.sheetValues' })

    const sheetValues = await fetchSheetValues()

    dispatch({ type: 'loadEnd.sheetValues', payload: { sheetValues } })
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
          questions={tutorial ? tutorialQuestions : questions}
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

function nonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
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
