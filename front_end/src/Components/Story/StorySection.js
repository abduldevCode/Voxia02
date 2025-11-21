import React, { useState } from 'react';
import StoryViewer from './StoryDetail';
import StoryPreview from './Story';
import './Story.css';
import img01 from '../../Assets/img01.png';
import img02 from '../../Assets/img02.png';
import img03 from '../../Assets/img3.png';
import img04 from '../../Assets/img04.png';

const Std = () => {
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const stories = [
    {
      id: '1',
      imageUrl: img01,
      username: 'john_doe',
    },
    {
      id: '2',
      imageUrl: img02,
      username: 'jane_doe',
    },
    {
      id: '3',
      imageUrl: img03,
      username: 'bob_smith',
    },
    {
      id: '4',
      imageUrl: img04,
      username: 'alice_johnson',
    }
  ];

  const handleStoryClick = (index) => {
    setSelectedStoryIndex(index);
    setIsStoryViewerOpen(true); // Open the story viewer when a story is clicked
  };

  const handleCloseStoryViewer = () => {
    setIsStoryViewerOpen(false); // Close the story viewer
  };

  // Function to go to the next story
  const handleNextStory = () => {
    setSelectedStoryIndex((prev) => prev < stories.length - 1 ? prev + 1 : prev)}

  // Function to go to the previous story
  const handlePreviousStory = () => {
    setSelectedStoryIndex((prev) => prev > 0 ? prev - 1 : prev )};

  return (
    <div className="app2">
   
        <div className="story-preview-list">
          {stories.map((story, index) => (
            <StoryPreview
              key={story.id}
              imageUrl={story.imageUrl}
              username={story.username}
              onClick={() => handleStoryClick(index)} // Set selected story on click
            />
          ))}
        </div>
        {isStoryViewerOpen && 
        <StoryViewer
          stories={stories}
          currentIndex={selectedStoryIndex}
          setIndex={setSelectedStoryIndex}
          onClose={handleCloseStoryViewer}
          onNext={handleNextStory} // Pass the function for next story navigation
          onPrevious={handlePreviousStory} // Pass the function for previous story navigation
        />
        }

    </div>
  );
};

export default Std;
