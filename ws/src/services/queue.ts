import Redis from "ioredis"

type Move = {}

const insertMoveToDatabase = async (data: Move) => {
  console.log(data)
}

class Queue {
  private static instance: Queue
  private redis: Redis
  private queueKey: string
  private processing: boolean

  constructor() {
    this.redis = new Redis()
    this.queueKey = "game_moves_queue"
    this.processing = false
  }

  static getInstance() {
    if (Queue.instance) {
      return Queue.instance
    }

    Queue.instance = new Queue()
    return Queue.instance
  }

  async pushMove(move: Move) {
    const moveData = { ...move }
    await this.redis.rpush(this.queueKey, JSON.stringify(moveData))
    this.processQueue()
  }

  async processQueue() {
    if (this.processing) return

    this.processing = true
    try {
      while (true) {
        const move = await this.redis.lpop(this.queueKey)
        if (!move) break

        const moveData = JSON.parse(move)
        await insertMoveToDatabase(moveData)
      }
    } catch (error) {
      console.error("Error processing queue:", error)
    } finally {
      this.processing = false
    }
  }
}

const moveQueue = new Queue()

export default moveQueue
