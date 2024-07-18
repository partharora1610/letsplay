class PubSubManager {
  private static instance: PubSubManager
  private subscriptions: Map<string, string[]>

  constructor() {
    this.subscriptions = new Map()
    console.log("PubSubManager initialized")
    console.log(this.subscriptions)
  }

  static getInstance() {
    if (PubSubManager.instance) {
      return PubSubManager.instance
    }

    PubSubManager.instance = new PubSubManager()
    return PubSubManager.instance
  }
}

export default PubSubManager
