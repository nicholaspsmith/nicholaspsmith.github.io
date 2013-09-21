require 'rubygems'
require 'bundler/setup'
require 'rspec'
require_relative '../lib/list'



describe List::Item do
  describe ".initialize" do
    context "when list item is created" do
    	it "creates a new list item with name and current time" do
    		item1 = List::Item.new("Fremen")
        item1.time_created = time = Time.now

    		expect(item1.name).to eq("Fremen")
    		expect(item1.time_created).to eq(time)
    	end
    end
  end
end

describe List::Collection do
  describe ".initialize" do
    context "when a collection of list items is created" do
    	it "creates a blank array with a time_due" do
        time = Time.now
    		list1 = List::Collection.new(time)

        expect(list1.time_due).to eq(time)
        expect(list1.todo_list).to eq([])
    	end
    end
  end
end 