import { useMemo, useState } from 'react'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

// Turn whatever is typed into a usable number (blank or invalid counts as 0).
function toNumber(value) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function App() {
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [mode, setMode] = useState('percent') // 'percent' or 'amount'

  const { priceValue, savings, finalPrice, percentOff } = useMemo(() => {
    const priceValue = Math.max(0, toNumber(price))
    const discountValue = Math.max(0, toNumber(discount))

    // A percent can't exceed 100, and a flat discount can't exceed the price.
    const savings =
      mode === 'percent'
        ? (priceValue * Math.min(discountValue, 100)) / 100
        : Math.min(discountValue, priceValue)

    const finalPrice = Math.max(0, priceValue - savings)
    const percentOff = priceValue > 0 ? (savings / priceValue) * 100 : 0

    return { priceValue, savings, finalPrice, percentOff }
  }, [price, discount, mode])

  const hasPrice = priceValue > 0

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8 dark:border-slate-700 dark:bg-slate-800">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Discount Calculator</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enter a price and a discount to see your final cost.
          </p>
        </header>

        <div className="space-y-5">
          {/* Original price */}
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium">
              Original price
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                $
              </span>
              <input
                id="price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-3 pl-7 text-lg outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-900 dark:focus:ring-indigo-900"
              />
            </div>
          </div>

          {/* Discount */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="discount" className="block text-sm font-medium">
                Discount
              </label>
              <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium dark:bg-slate-700">
                <button
                  type="button"
                  onClick={() => setMode('percent')}
                  className={`rounded-md px-2.5 py-1 transition ${
                    mode === 'percent'
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-300'
                  }`}
                >
                  % off
                </button>
                <button
                  type="button"
                  onClick={() => setMode('amount')}
                  className={`rounded-md px-2.5 py-1 transition ${
                    mode === 'amount'
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-300'
                  }`}
                >
                  $ off
                </button>
              </div>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                {mode === 'percent' ? '%' : '$'}
              </span>
              <input
                id="discount"
                type="number"
                inputMode="decimal"
                min="0"
                max={mode === 'percent' ? 100 : undefined}
                step="0.01"
                placeholder="0"
                value={discount}
                onChange={(event) => setDiscount(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-3 pl-7 text-lg outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-900 dark:focus:ring-indigo-900"
              />
            </div>

            {mode === 'percent' && (
              <div className="mt-2 flex flex-wrap gap-2">
                {[10, 20, 25, 50].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDiscount(String(value))}
                    className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
                  >
                    {value}%
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Result */}
          <div className="rounded-xl bg-slate-50 p-5 text-center dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">You pay</p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
              {hasPrice ? currency.format(finalPrice) : '—'}
            </p>
            {hasPrice ? (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                You save{' '}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {currency.format(savings)}
                </span>{' '}
                ({percentOff.toFixed(percentOff % 1 === 0 ? 0 : 1)}% off)
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Enter a price to see the result.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setPrice('')
              setDiscount('')
              setMode('percent')
            }}
            className="w-full rounded-lg border border-slate-300 py-2.5 font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Reset
          </button>
        </div>
      </div>
    </main>
  )
}

export default App
