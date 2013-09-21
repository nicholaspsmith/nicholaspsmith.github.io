require 'rubygems'
require 'bundler/setup'
require 'rspec'
require_relative '../lib/list'



describe List::Item do
  describe ".initialize" do
    let(:item) { List::Item.new("Fremen") }
    context "when list item is created" do
    	it "creates a new list item with name and current time" do
    		item1 = List::Item.new("Fremen")
        item1.time_created = time = Time.now

    		expect(item1.name).to eq("Fremen")
    		expect(item1.time_created).to eq(time)
    	end

      it "creates an attribue 'comlete' that defaults to false" do
        expect(item.complete).to eq(false)
      end
    end
  end

  describe "#check_off" do
    let (:item) { List::Item.new("Fremen") }
    context "when an item is completed" do
      it "changes the complete attribute of the item to true" do
        item.check_off
        expect(item.complete).to eq(true)
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

  describe "#add_item" do
    let(:list) { List::Collection.new(Time.now + 5000) }
    let(:item) { List::Item.new("Fremen") }
    context "when a new item is added to colleciton" do
      it "pushes item to todo_list array" do
        list.add_item(item)

        expect(list.todo_list).to eq([item])
      end
    end
  end
end 