module.exports = {
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  semi: true, // 在每個語句的末尾添加分號。
  singleQuote: true, // 使用單引號而不是雙引號。
  tabWidth: 2, // 每個縮進級別使用 2 個空格。
  trailingComma: 'all', // 在對象、數組、等的最後一個元素後面添加尾逗號。
  bracketSameLine: false, // 在 JSX 中將閉合標籤 '>' 放在新行而不是同一行。
  importOrder: [
    '^(^react$|@react|react)', // 首先排序 react、@react 或含有 react 的導入。
    '<THIRD_PARTY_MODULES>', // 其次是第三方模組的導入。
    '^~/(.*)$', // 接下來是 ~ 開頭的模組。
    '^[./]', // 最後是相對路徑的導入。
  ],

  importOrderSeparation: false, // 不同組別的導入之間不添加空行。
  importOrderSortSpecifiers: true, // 導入語句的 specifiers 排序。
  arrowParens: 'avoid', // 當箭頭函數只有一個參數時，省略括號。
  printWidth: 120, // 每行最大長度設置為 120 個字元。
};
