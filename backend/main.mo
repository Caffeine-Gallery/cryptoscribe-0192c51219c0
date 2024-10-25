import Text "mo:base/Text";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";
import Order "mo:base/Order";

actor {
    // Post type definition
    public type Post = {
        id: Nat;
        title: Text;
        body: Text;
        author: Text;
        timestamp: Int;
    };

    // Store posts in a stable variable
    stable var posts : [Post] = [];
    stable var nextId : Nat = 0;

    // Add a new post
    public func createPost(title: Text, body: Text, author: Text) : async Post {
        let post : Post = {
            id = nextId;
            title = title;
            body = body;
            author = author;
            timestamp = Time.now();
        };
        
        nextId += 1;
        posts := Array.append(posts, [post]);
        return post;
    };

    // Get all posts sorted by timestamp (newest first)
    public query func getPosts() : async [Post] {
        Array.sort<Post>(posts, func(a: Post, b: Post) : Order.Order {
            Int.compare(b.timestamp, a.timestamp)
        })
    };
}
