# React Hooks 상세 가이드

이 문서는 React의 내장 훅(Hooks)들에 대한 상세한 사용법과 예제 코드를 정리한 가이드입니다.

---

## 1. 주요 훅 (Common Hooks)

일상적인 개발에서 가장 빈번하게 사용되며, 리액트의 핵심 메커니즘을 담당하는 훅들입니다.

### 1) `useState`

컴포넌트에서 동적인 데이터를 관리할 때 사용합니다. 상태가 변경되면 컴포넌트가 다시 렌더링됩니다.

- **기본 문법**:
  ```javascript
  const [state, setState] = useState(initialState)
  ```
- **상세 예시**:

  ```tsx
  import React, { useState } from "react"

  function Counter() {
    const [count, setCount] = useState(0)
    const [text, setText] = useState("")

    // 이전 상태를 기반으로 업데이트할 때는 함수형 업데이트가 권장됩니다.
    // 이는 비동기 업데이트 시 발생할 수 있는 문제를 방지합니다.
    const increment = () => setCount((prev) => prev + 1)

    return (
      <div>
        <p>현재 카운트: {count}</p>
        <button onClick={increment}>증가</button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="텍스트 입력"
        />
      </div>
    )
  }
  ```

### 2) `useEffect`

컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 설정합니다. (API 호출, 구독, 수동 DOM 조작 등)

- **상세 예시**:

  ```tsx
  import React, { useState, useEffect } from "react"

  function Timer() {
    const [count, setCount] = useState(0)

    useEffect(() => {
      // 1. 마운트 시 실행 (API 호출이나 타이너 시작)
      const interval = setInterval(() => {
        setCount((prev) => prev + 1)
      }, 1000)

      // 2. 정리(Cleanup) 함수: 컴포넌트가 언마운트되거나 다음 효과가 실행되기 전 호출
      return () => {
        clearInterval(interval)
        console.log("타이머 정리됨")
      }
    }, []) // 빈 배열인 경우 마운트/언마운트 시에만 실행

    return <div>경과 시간: {count}초</div>
  }
  ```

### 3) `useMemo`

계산 비용이 큰 함수의 결과 값을 메모이제이션하여, 불필요한 재계산을 방지합니다.

- **상세 예시**:

  ```tsx
  import React, { useState, useMemo } from "react"

  function ExpensiveComponent({ items }) {
    const [filter, setFilter] = useState("")

    // items나 filter가 변경될 때만 정렬 연산을 다시 수행합니다.
    const sortedItems = useMemo(() => {
      console.log("복잡한 정렬 연산 수행 중...")
      return items.filter((item) => item.includes(filter)).sort()
    }, [items, filter])

    return (
      <div>
        <input onChange={(e) => setFilter(e.target.value)} placeholder="필터" />
        <ul>
          {sortedItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    )
  }
  ```

### 4) `useCallback`

함수 자체를 메모이제이션합니다. 특히 자식 컴포넌트에 props로 함수를 전달할 때, 함수가 매번 새로 생성되어 자식 컴포넌트가 불필요하게 리렌더링되는 것을 막습니다.

- **상세 예시**:

  ```tsx
  import React, { useState, useCallback } from "react"

  const SmallButton = React.memo(({ onClick }) => {
    console.log("Button 렌더링됨")
    return <button onClick={onClick}>클릭</button>
  })

  function Parent() {
    const [count, setCount] = useState(0)

    // handleAction은 의존성 배열인 []가 변하지 않는 이상 재생성되지 않습니다.
    // 덕분에 SmallButton(React.memo 적용)은 리렌더링되지 않습니다.
    const handleAction = useCallback(() => {
      console.log("액션 실행")
    }, [])

    return (
      <div>
        <p>카운트: {count}</p>
        <button onClick={() => setCount(count + 1)}>부모 카운트 증가</button>
        <SmallButton onClick={handleAction} />
      </div>
    )
  }
  ```

### 5) `useRef`

렌더링과 상관없이 값을 유지하고 싶거나, DOM 요소에 직접 접근할 때 사용합니다. 값이 바뀌어도 리렌더링이 일어나지 않습니다.

- **상세 예시**:

  ```tsx
  import React, { useRef } from "react"

  function TextInputWithFocusButton() {
    const inputRef = useRef<HTMLInputElement>(null)

    const onButtonClick = () => {
      // `current`는 마운트된 text input 요소를 가리킵니다.
      inputRef.current?.focus()
    }

    return (
      <>
        <input ref={inputRef} type="text" />
        <button onClick={onButtonClick}>입력창에 포커스</button>
      </>
    )
  }
  ```

---

## 2. 권장 사항 (Best Practices)

1. **의존성 배열 관리**: `useEffect`, `useMemo`, `useCallback` 등을 사용할 때 내부에서 사용하는 모든 외부 변수는 의존성 배열에 포함시켜야 합니다. (ESLint의 `exhaustive-deps` 규칙 활용)
2. **함수형 업데이트**: 이전 상태값을 참조하여 상태를 업데이트할 때는 `setState(prev => prev + 1)` 형식을 사용하여 최신 상태임을 보장하세요.
3. **과도한 최적화 지양**: `useMemo`나 `useCallback`은 메모리 비용이 발생하므로, 성능 병목이 확실히 예상되는 경우에만 선택적으로 적용하는 것이 좋습니다.

---

> [!NOTE]
> 본 가이드는 리액트 공식 문서의 권장 패턴을 기반으로 작성되었습니다.
