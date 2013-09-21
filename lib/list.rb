module List
  class Collection
    attr_accessor :todo_list, :time_due
    def initialize(time_due)
      @todo_list = []
      @time_due = time_due
    end
  end

  class Item
    attr_accessor :name, :time_created
    def initialize(name)
      @name = name
      @time_created = Time.now
    end
  end
end