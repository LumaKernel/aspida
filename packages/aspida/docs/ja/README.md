# aspida
<br />
<br />
<br />
<br />
<img src="https://aspida.github.io/aspida/logos/svg/black.svg" alt="aspida" title="aspida" width="1000" height="120" />
<br />
<br />
<div align="center">
  <a href="https://www.npmjs.com/package/aspida">
    <img src="https://img.shields.io/npm/v/aspida" alt="npm version" />
  </a>
  <a href="https://github.com/aspida/aspida/actions?query=workflow%3A%22Node.js+CI%22">
    <img src="https://github.com/aspida/aspida/workflows/Node.js%20CI/badge.svg?branch=master" alt="Node.js CI" />
  </a>
  <a href="https://codecov.io/gh/aspida/aspida">
    <img src="https://img.shields.io/codecov/c/github/aspida/aspida.svg" alt="Codecov" />
  </a>
  <a href="https://lgtm.com/projects/g/aspida/aspida/context:javascript">
    <img src="https://img.shields.io/lgtm/grade/javascript/g/aspida/aspida.svg" alt="Language grade: JavaScript" />
  </a>
  <a href="https://github.com/aspida/aspida/blob/master/packages/aspida/LICENSE">
    <img src="https://img.shields.io/npm/l/aspida" alt="License" />
  </a>
</div>
<br />
<p align="center">ブラウザと node.js のためのTypeScriptフレンドリーな HTTP クライアントラッパー</p>
<div align="center">
  <a href="https://github.com/aspida/aspida/tree/master/packages/aspida#readme">🇺🇸English</a> |
  <a href="https://github.com/aspida/aspida/tree/master/packages/aspida/docs/ja#readme">🇯🇵日本語</a>
</div>
<br />
<br />

## 特徴

- パス・URL クエリ・ヘッダー・ボディ・レスポンス全てに型を指定できる
- FormData / URLSearchParams の内容にも型を指定できる
- HTTP クライアントは axios / ky / ky-universal / fetch / node-fetch に対応

<br />
<img src="https://aspida.github.io/aspida/assets/images/vscode.gif" width="720" alt="vscode" />
<br />

## 手順

1. エンドポイントのディレクトリ構造を api ディレクトリに再現する
1. "Methods" という名前で Type alias を export する
1. npm scripts で "aspida" を呼び出す
1. API 型定義ファイル api/\$api.ts が生成されるのでアプリケーションで import して HTTP リクエストを行う

## 入門

### インストール (axios ver.)

- Using [npm](https://www.npmjs.com/):

  ```sh
  $ npm install @aspida/axios axios
  ```

- Using [Yarn](https://yarnpkg.com/):

  ```sh
  $ yarn add @aspida/axios axios
  ```

### api ディレクトリを作成する

```sh
$ mkdir api
```

### エンドポイントの型定義ファイルを作成する

- GET: /v1/users/?limit={number}
- POST: /v1/users

  `api/v1/users/index.ts`

  ```typescript
  type User = {
    id: number
    name: string
  }

  export type Methods = {
    get: {
      query?: {
        limit: number
      }

      resBody: User[]
    }

    post: {
      reqBody: {
        name: string
      }

      resBody: User
    }
  }
  ```

- GET: /v1/users/\${userId}
- PUT: /v1/users/\${userId}

  `api/v1/users/_userId@number/index.ts`

  アンダースコアから始まるパス変数「userId」の型を「@number」で指定する  
  @での指定がない場合、パス変数の型のデフォルトは「number | string」

  ```typescript
  type User = {
    id: number
    name: string
  }

  export type Methods = {
    get: {
      resBody: User
    }

    put: {
      reqBody: {
        name: string
      }

      resBody: User
    }
  }
  ```

### 型定義ファイルをビルドする

`package.json`

```json
{
  "scripts": {
    "api:build": "aspida"
  }
}
```

```sh
$ npm run api:build

> api/$api.ts was built successfully.
```

### アプリケーションから HTTP リクエストを行う

`src/index.ts`

```typescript
import aspida from "@aspida/axios"
import api from "../api/$api"
;(async () => {
  const userId = 0
  const limit = 10
  const client = api(aspida())

  await client.v1.users.post({ body: { name: "taro" } })

  const res = await client.v1.users.get({ query: { limit } })
  console.log(res)
  // req -> GET: /v1/users/?limit=10
  // res -> { status: 200, body: [{ id: 0, name: "taro" }], headers: {...} }

  const user = await client.v1.users._userId(userId).$get()
  console.log(user)
  // req -> GET: /v1/users/0
  // res -> { id: 0, name: "taro" }
})()
```

### Qiita の投稿記事を読む

**[aspida - Qiita](https://qiita.com/tags/aspida)**

### aspida 公式 HTTP クライアント

- **[@aspida/axios](https://github.com/aspida/aspida/tree/master/packages/aspida-axios#readme)**
- **[@aspida/ky](https://github.com/aspida/aspida/tree/master/packages/aspida-ky#readme)**
- **[@aspida/fetch](https://github.com/aspida/aspida/tree/master/packages/aspida-fetch#readme)**
- **[@aspida/node-fetch](https://github.com/aspida/aspida/tree/master/packages/aspida-node-fetch#readme)**

## Command Line Interface のオプション

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Type</th>
      <th>Default</th>
      <th width="100%">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td nowrap><code>--config</code><br /><code>-c</code></td>
      <td><code>string</code></td>
      <td><code>"aspida.config.js"</code></td>
      <td>設定ファイルまでのパスを指定</td>
    </tr>
    <tr>
      <td nowrap><code>--watch</code><br /><code>-w</code></td>
      <td></td>
      <td></td>
      <td>
        監視モードを有効にし、API のエンドポイントとなるファイルの増減に合わせて
        <code>$api.ts</code> を再生成
      </td>
    </tr>
    <tr>
      <td nowrap><code>--version</code><br /><code>-v</code></td>
      <td></td>
      <td></td>
      <td>aspida のバージョンを表示</td>
    </tr>
  </tbody>
</table>

## aspida.config.js のオプション

| Option        | Type    | Default       | Description                                        |
| ------------- | ------- | ------------- | -------------------------------------------------- |
| input         | string  | "api", "apis" | エンドポイントの型定義ルートディレクトリを指定     |
| baseURL       | string  | ""            | リクエスト時の baseURL を指定                      |
| trailingSlash | boolean | false         | リクエスト URL の末尾に `/` を付与                 |
| outputEachDir | boolean | false         | `$api.ts` を各エンドポイントのディレクトリにも生成 |

## Node.js API

```ts
import { version, build, watch } from "aspida/dist/commands"

console.log(version()) // 0.x.y

build()
build("./app/aspida.config.js")
build({ input: "api1" })
build([
  { baseURL: "https://example.com/v1" },
  {
    input: "api2",
    baseURL: "https://example.com/v2",
    trailingSlash: true,
    outputEachDir: true
  }
])

watch()
watch("./app/aspida.config.js")
watch({ input: "api1" })
watch([
  { baseURL: "https://example.com/v1" },
  {
    input: "api2",
    baseURL: "https://example.com/v2",
    trailingSlash: true,
    outputEachDir: true
  }
])
```

## Tips

1. [型定義ファイルを置くディレクトリを api 以外に変更する](#tips1)
1. [GET パラメータを手動でシリアライズする](#tips2)
1. [FormData を POST する](#tips3)
1. [URLSearchParams を POST する](#tips4)
1. [レスポンスを ArrayBuffer で受け取る](#tips5)
1. [OpenAPI / Swagger から変換する](#tips6)
1. [特殊文字を含む URL を定義する](#tips7)
1. [一部のエンドポイントのみ import する](#tips8)
1. [エンドポイントの URL 文字列を取得する](#tips9)
1. [TSDoc コメントを記載する](#tips10)
1. [モックを利用する](#tips11)
1. [SWR (React Hooks) と併用する](#tips12)
1. [SWRV (Vue Composition API) と併用する](#tips13)

<a id="tips1"></a>

### 型定義ファイルを置くディレクトリを api 以外に変更する

設定ファイルをプロジェクトのルートに作成する

`aspida.config.js`

```javascript
module.exports = { input: "src" }
```

baseURL を設定ファイルで指定する

```javascript
module.exports = { baseURL: "https://example.com/api" }
```

複数の API エンドポイントを型定義したい場合は配列で指定する

```javascript
module.exports = [
  { input: "api1" },
  { input: "api2", baseURL: "https://example.com/api" }
]
```

<a id="tips2"></a>

### GET パラメータを手動でシリアライズする

aspida は GET パラメータのシリアライズを HTTP クライアントの標準動作に任せている  
手動でシリアライズを行いたい場合は HTTP クライアントの Config オブジェクトを利用できる

`src/index.ts`

```typescript
import axios from "axios"
import qs from "qs"
import aspida from "@aspida/axios"
import api from "../api/$api"
;(async () => {
  const client = api(
    aspida(axios, { paramsSerializer: params => qs.stringify(params, { indices: false }) })
  )

  const users = await client.v1.users.$get({
    // config: { paramsSerializer: (params) => qs.stringify(params, { indices: false }) },
    query: { ids: [1, 2, 3] }
  })
  console.log(users)
  // req -> GET: /v1/users/?ids=1&ids=2&ids=3
  // res -> [{ id: 1, name: "taro1" }, { id: 2, name: "taro2" }, { id: 3, name: "taro3" }]
})()
```

<a id="tips3"></a>

### FormData を POST する

`api/v1/users/index.ts`

```typescript
export type Methods = {
  post: {
    reqFormat: FormData

    reqBody: {
      name: string
      icon: Blob
    }

    resBody: {
      id: number
      name: string
    }
  }
}
```

`src/index.ts`

```typescript
import aspida from "@aspida/axios"
import api from "../api/$api"
;(async () => {
  const client = api(aspida())

  const user = await client.v1.users.$post({
    body: {
      name: "taro",
      icon: imageBlob
    }
  })
  console.log(user)
  // req -> POST: /v1/users
  // res -> { id: 0, name: "taro" }
})()
```

<a id="tips4"></a>

### URLSearchParams を POST する

`api/v1/users/index.ts`

```typescript
export type Methods = {
  post: {
    reqFormat: URLSearchParams

    reqBody: {
      name: string
    }

    resBody: {
      id: number
      name: string
    }
  }
}
```

`src/index.ts`

```typescript
import aspida from "@aspida/axios"
import api from "../api/$api"
;(async () => {
  const client = api(aspida())

  const user = await client.v1.users.$post({ body: { name: "taro" } })
  console.log(user)
  // req -> POST: /v1/users
  // res -> { id: 0, name: "taro" }
})()
```

<a id="tips5"></a>

### レスポンスを ArrayBuffer で受け取る

`api/v1/users/index.ts`

```typescript
export type Methods = {
  get: {
    query: {
      name: string
    }

    resBody: ArrayBuffer
  }
}
```

`src/index.ts`

```typescript
import aspida from "@aspida/axios"
import api from "../api/$api"
;(async () => {
  const client = api(aspida())

  const user = await client.v1.users.$get({ query: { name: "taro" } })
  console.log(user)
  // req -> GET: /v1/users/?name=taro
  // res -> ArrayBuffer
})()
```

<a id="tips6"></a>

### OpenAPI / Swagger から変換する

OpenAPI3.0/Swagger2.0のyaml/jsonに対応

`tarminal`

```sh
$ npx openapi2aspida -i https://petstore.swagger.io/v2/swagger.json
# api/$api.ts was built successfully.
```

[openapi2aspida ドキュメント](https://github.com/aspida/openapi2aspida)

<a id="tips7"></a>

### 特殊文字を含む URL を定義する

特殊文字はパーセントエンコーディングしてファイル名に指定する  
例 `":"` -> `"%3A"`

`api/foo%3Abar/index.ts`

```ts
export type Methods = {
  get: {
    resBody: string
  }
}
```

クライアントでは `"%3A"` -> `"_3A"` となる

`src/index.ts`

```typescript
import aspida from "@aspida/axios"
import api from "../api/$api"
;(async () => {
  const client = api(aspida())

  const message = await client.foo_3Abar.$get()
  console.log(message)
  // req -> GET: /foo%3Abar (= /foo:bar)
})()
```

<a id="tips8"></a>

### 一部のエンドポイントのみ import する

`api/$api.ts` の全てを使う必要がない場合、分割して一部のみ import できる  
`outputEachDir` オプションで各エンドポイントのディレクトリに `$api.ts` が生成される  
パス変数を含むディレクトリ配下に `$api.ts` は生成されない

`aspida.config.js`

```js
module.exports = { outputEachDir: true }
```

使いたいエンドポイントの `$api.ts` のみを import してオブジェクトにまとめる

`src/index.ts`

```typescript
import aspida from "@aspida/axios"
import api0 from "../api/v1/foo/$api"
import api1 from "../api/v2/bar/$api"
;(async () => {
  const aspidaClient = aspida()
  const client = {
    foo: api0(aspidaClient),
    bar: api1(aspidaClient)
  }

  const message = await client.bar._id(1).$get()
  // req -> GET: /v2/bar/1
})()
```

<a id="tips9"></a>

### エンドポイントの URL 文字列を取得する

`src/index.ts`

```ts
import aspida from "@aspida/axios"
import api from "../api/$api"
;(async () => {
  const client = api(aspida())

  console.log(client.v1.users.$path())
  // /v1/users

  console.log(client.vi.users.$path({ query: { limit: 10 } }))
  // /v1/users?limit=10

  console.log(client.vi.users.$path({
    method: 'post',
    query: { id: 1 }
  }))
  // /v1/users?id=1
})()
```

<a id="tips10"></a>

### TSDoc コメントを記載する

`api/index.ts`

```ts
/**
 * root comment
 * 
 * @remarks
 * root remarks comment
 */
export type Methods = {
  /**
   * post method comment
   * 
   * @remarks
   * post method remarks comment
   */
  post: {
    /** post query comment */
    query: { limit: number }

    /** post reqHeaders comment */
    reqHeaders: { token: string }

    reqFormat: FormData
    /** post reqBody comment */
    reqBody: UserCreation

    /**
     * post resBody comment1
     * post resBody comment2
     */
    resBody: User
  }
}
```

```sh
$ npm run api:build
```

`api/$api.ts`

```ts
/**
 * root comment
 * 
 * @remarks
 * root remarks comment
 */
const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  return {
    /**
     * post method comment
     * 
     * @remarks
     * post method remarks comment
     * 
     * @param option.query - post query comment
     * @param option.headers - post reqHeaders comment
     * @param option.body - post reqBody comment
     * @returns post resBody comment1
     * post resBody comment2
     */
    $post: (option: { body: Methods0['post']['reqBody'], query: Methods0['post']['query'], headers: Methods0['post']['reqHeaders'], config?: T }) =>
      fetch<Methods0['post']['resBody']>(prefix, PATH0, POST, option).json().then(r => r.body)
  }
}
```

<a id="tips11"></a>

### モックを利用する

**[GitHub aspida-mock](https://github.com/aspida/aspida-mock/tree/master/docs/ja)**

<a id="tips12"></a>

### SWR (React Hooks) と併用する

**[GitHub @aspida/swr](https://github.com/aspida/aspida/tree/master/packages/aspida-swr#readme)**

<a id="tips13"></a>

### SWRV (Vue Composition API) と併用する

**[GitHub @aspida/swrv](https://github.com/aspida/aspida/tree/master/packages/aspida-swrv#readme)**

## サポート

<a href="https://twitter.com/m_mitsuhide">
  <img src="https://aspida.github.io/aspida/assets/images/twitter.svg" width="50" alt="Twitter" />
</a>

## ライセンス

aspida is licensed under a [MIT License](https://github.com/aspida/aspida/blob/master/packages/aspida/LICENSE).
