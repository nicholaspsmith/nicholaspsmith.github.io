module List
  class Item
    attr_accessor :name, :time_created, :complete
    def initialize(name)
      @name = name
      @time_created = Time.now
      @complete = false
    end

    def check_off
      @complete = true
    end
  end


  class Collection
    attr_accessor :todo_list, :time_due
    def initialize(time_due)
      @todo_list = []
      @time_due = time_due
    end

    def add_item(item)
      @todo_list << item
    end
  end
end