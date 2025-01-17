---@meta
C_Timer = {}

---[Documentation](https://wowpedia.fandom.com/wiki/API_C_Timer.After)
---@param seconds number
---@param callback TimerCallback
function C_Timer.After(seconds, callback) end

---[Documentation](https://wowpedia.fandom.com/wiki/API_C_Timer.NewTicker)
---@param seconds number
---@param callback TickerCallback
---@param iterations? number
---@return TickerCallback cbObject
function C_Timer.NewTicker(seconds, callback, iterations) end

---[Documentation](https://wowpedia.fandom.com/wiki/API_C_Timer.NewTimer)
---@param seconds number
---@param callback TickerCallback
---@return TickerCallback cbObject
function C_Timer.NewTimer(seconds, callback) end
