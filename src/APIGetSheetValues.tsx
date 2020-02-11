import { useEffect, useRef } from '/app/web_modules/preact/hooks.js'
import { useSelector, useDispatch } from './reducer.js'

export default function APIGetSheetValues() {
  const dispatch = useDispatch()

  const fetching = useRef<ReturnType<typeof fetchSheetValues> | null>(null)
  const awaitsLoading = useSelector(
    state =>
      state.loadingState === 'initial' ||
      state.loadingState === 'waiting' ||
      // preload で復帰してきたとき state は loading だが API が呼ばれていない状態になる
      (state.loadingState === 'loading' && !fetching.current),
  )

  useEffect(() => {
    if (!awaitsLoading) return

    dispatch({ type: 'APIGetSheetValues.Start' })

    fetching.current = fetchSheetValues()
    fetching.current.then(sheetValues => {
      fetching.current = null

      dispatch({ type: 'APIGetSheetValues.Complete', payload: { sheetValues } })
    })
  }, [awaitsLoading, dispatch])

  return null
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
