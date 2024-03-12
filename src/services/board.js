import { db } from '../models/index.js'
import { Op } from 'sequelize'

export class BoardService {
    async findAllBoard() {
        const allBoard = await db.Board.findAndCountAll({
            order: [['createdAt', 'DESC']],
            attributes: {
                include: [
                    [db.sequelize.col('User.user_nickName'), 'board_writer'],
                    [
                        db.sequelize.fn(
                            'COUNT',
                            db.sequelize.col('Board_likes.board_like_user_id')
                        ),
                        'board_like',
                    ],
                ],
            },
            include: [
                {
                    model: db.User,
                    attributes: [], // 이 속성이 없으면 User : User{} 속성도 dataValues에 추가
                },
                {
                    model: db.Board_like,
                    attributes: [],
                    where: {
                        board_like_board_id: db.sequelize.col('Board.board_id'),
                    },
                    required: false,
                },
            ],
            group: ['Board.board_id'], // board_id를 기준으로 그룹화
        })
        const allBoardDataArray = allBoard.rows.map(board => board.dataValues)
        // allBoard.count : [ { board_id: '~', count: 1 },{},... ]

        if (allBoard.count.length > 0) {
            return {
                result: true,
                message: '게시글 리스트 조회 성공',
                data: allBoardDataArray,
            }
        } else if (allBoard.count.length === 0) {
            return {
                result: true,
                message: '게시글 리스트 조회 성공',
                data: null,
            }
        } else {
            return {
                result: false,
                message: '게시글 리스트 조회 실패',
                data: null,
            }
        }
    }

    async searchList(queryDto) {
        let sortOrder

        switch (queryDto.sort) {
            case 'date_desc':
                sortOrder = ['createdAt', 'DESC']
                break
            case 'date_asc':
                sortOrder = ['createdAt', 'ASC']
                break
            case 'liked_desc':
                sortOrder = ['board_like', 'DESC']
                break
            case 'liked_asc':
                sortOrder = ['board_like', 'ASC']
                break
            case 'views_desc':
                sortOrder = ['board_view', 'DESC']
                break
            case 'views_asc':
                sortOrder = ['board_view', 'ASC']
                break
            default:
                sortOrder = ['createdAt', 'DESC'] // 기본값 : 최신순 정렬
        }

        const searchedBoard = await db.Board.findAndCountAll({
            where: {
                board_title: {
                    [Op.substring]: queryDto.q, // title에 검색어 포함 여부 확인
                },
            },
            order: [sortOrder], // 정렬 방식
            attributes: {
                include: [
                    [db.sequelize.col('User.user_nickname'), 'board_writer'],
                    [
                        db.sequelize.fn(
                            'COUNT',
                            db.sequelize.col('Board_likes.board_like_user_id')
                        ),
                        'board_like',
                    ],
                ],
            },
            include: [
                {
                    model: db.User,
                    attributes: [],
                },
                {
                    model: db.Board_like,
                    attributes: [],
                    where: {
                        board_like_board_id: db.sequelize.col('Board.board_id'),
                    },
                    required: false,
                },
            ],
            group: ['Board.board_id'],
        })

        const searchedBoardDataArray = searchedBoard.rows.map(
            board => board.dataValues
        )

        if (searchedBoard.count.length >= 0) {
            return {
                result: true,
                message: '검색된 게시글 리스트 조회 성공',
                data: searchedBoardDataArray,
            }
        } else {
            return {
                result: false,
                message: '검색된 게시글 리스트 조회 실패',
                data: null,
            }
        }
    }

    async checkFormAuth(formAuthDto) {
        const isUSerId = Boolean(formAuthDto.userId)

        // 로그인된 상태에만 게시글 작성 폼 조회 가능
        if (isUSerId) {
            return {
                result: true,
                message: '게시글 작성 폼 조회 성공',
            }
        } else {
            return {
                result: false,
                message: formAuthDto.tokenMsg,
            }
        }
    }

    async createBoard(newBoardDto) {
        // 작성한 게시글 저장

        const isUserId = Boolean(newBoardDto.userId)
        if (!isUserId) {
            return {
                result: false,
                message: newBoardDto.tokenMsg,
            }
        }

        const newBoard = await db.Board.create({
            board_title: newBoardDto.title,
            board_content: newBoardDto.content,
            board_user_id: newBoardDto.userId,
        })

        if (newBoard instanceof db.Board) {
            return {
                result: true,
                message: '게시글 저장 성공',
            }
        } else {
            return {
                result: false,
                message: '게시글 저장 실패',
            }
        }
    }

    async getOriginalById(boardAuthDto) {
        // 게시글 수정을 위해 게시글 원본 반환

        const original = await db.Board.findOne({
            where: { board_id: boardAuthDto.boardId },
        }) // 반환객체 : Board{ dataValues: {}, _previousDataValues: {}, ... }

        const isValid = Boolean(
            boardAuthDto.userId === original.dataValues.board_user_id
        )
        if (!isValid) {
            return {
                result: false,
                message: boardAuthDto.tokenMsg || '작성자와 불일치',
                data: null,
            }
        }

        if (original instanceof db.Board) {
            return {
                result: true,
                message: '게시글 수정 페이지 조회',
                data: {
                    originalTitle: original.dataValues.board_title,
                    originalContent: original.dataValues.board_content,
                },
            }
        } else if (original === null) {
            return {
                result: false,
                message: '게시글 수정 페이지 조회 실패',
                data: null,
            }
        } else {
            return {
                result: false,
                message: '게시글 수정 페이지 조회 오류',
                data: null,
            }
        }
    }

    async updateBoardById(updatedBoardDto) {
        // 수정된 게시글 데이터 저장

        const updatedRowsNum = await db.Board.update(
            {
                board_title: updatedBoardDto.title,
                board_content: updatedBoardDto.content,
            },
            {
                where: {
                    board_id: updatedBoardDto.boardId,
                },
            }
        )

        if (updatedRowsNum[0] > 0) {
            // console.log(updatedRowsNum[0], '개의 행이 업데이트 됨!')
            return { result: true, message: '수정 완료' }
        } else {
            return { result: false, message: '수정 실패' }
        }
    }

    async getBoardById(boardAuthDto) {
        // 게시글 아이디와 일치하는 게시글 데이터 반환

        const foundBoard = await db.Board.findOne({
            where: { board_id: boardAuthDto.boardId },
            attributes: {
                include: [
                    [db.sequelize.col('User.user_nickName'), 'board_writer'],
                    [
                        db.sequelize.fn(
                            'COUNT',
                            db.sequelize.col('Board_likes.board_like_user_id')
                        ),
                        'board_like',
                    ],
                ],
            },
            include: [
                {
                    model: db.User,
                    attributes: [],
                },
                {
                    model: db.Board_like,
                    attributes: [],
                    where: {
                        board_like_board_id: db.sequelize.col('Board.board_id'),
                    },
                    required: false,
                },
            ],
            group: ['Board.board_id'], // board_id를 기준으로 그룹화
        })

        const isAuth = Boolean(
            // 현재 사용자와 게시글 작성자의 일치 여부
            foundBoard.dataValues?.board_user_id === boardAuthDto.userId
        )

        if (foundBoard instanceof db.Board) {
            return {
                result: true,
                message: '게시글 조회 성공',
                data: {
                    title: foundBoard.dataValues.board_title,
                    content: foundBoard.dataValues.board_content,
                },
                isAuth,
            }
        } else if (foundBoard === null) {
            return {
                result: false,
                message: '게시글 미존재',
                data: null,
                isAuth,
            }
        } else {
            return {
                result: false,
                message: '게시글 조회 오류',
                data: null,
                isAuth,
            }
        }
    }

    async updateView(viewDto) {
        const updatedRowsNum = await db.Board.update(
            {
                board_view: viewDto.view,
            },
            {
                where: { board_id: viewDto.boardId },
            }
        )

        if (updatedRowsNum[0] > 0) {
            return { result: true, message: '게시글 조회수 업데이트 완료' }
        } else {
            return { result: false, message: '게시글 조회수 업데이트 실패' }
        }
    }

    async deleteBoardById(boardIdDto) {
        // 게시글 아이디 boardIdDto와 일치하는 게시글 데이터 삭제

        const board = await db.Board.findOne({
            where: { board_id: boardIdDto.boardId },
        })

        const isValid = Boolean(board.board_user_id === boardIdDto.userId)
        if (!isValid) {
            return {
                result: false,
                message: boardIdDto.tokenMsg || '삭제 권한 없음',
            }
        }

        const deletedRowNum = await db.Board.destroy({
            where: { board_id: boardIdDto.boardId },
        }) // 반환값 : 삭제된 열의 갯수

        if (deletedRowNum > 0) {
            return { result: true, message: '삭제 성공' }
        } else if (deletedRowNum === 0) {
            return { result: false, message: '삭제할 게시글이 존재하지 않음' }
        } else {
            return { result: false, message: '삭제 실패' }
        }
    }

    async checkLike(boardAuthDto) {
        const liked = await db.Board_like.findOne({
            where: {
                board_like_user_id: boardAuthDto.userId,
                board_like_board_id: boardAuthDto.boardId,
            },
        })

        if (liked instanceof db.Board_like) {
            return {
                result: true,
                message: '게시글을 좋아요한 유저',
                isLike: true,
            }
        } else if (liked === null) {
            return {
                result: true,
                message: '게시글을 좋아요하지 않은 유저',
                isLike: false,
            }
        } else {
            return { result: false, message: req.tokenMsg || '서버 오류' }
        }
    }

    async likeBoard(boardAuthDto) {
        const newLike = await db.Board_like.create({
            board_like_user_id: boardAuthDto.userId, // 현재 유저 id
            board_like_board_id: boardAuthDto.boardId, // 게시글 id
        })
        if (newLike instanceof db.Board_like) {
            return { result: true, message: '게시글 좋아요 성공' }
        } else {
            return {
                result: false,
                message: req.tokenMsg || '서버 오류',
            }
        }
    }

    async deleteLike(boardAuthDto) {
        const deletedRowNum = await db.Board_like.destroy({
            where: {
                board_like_user_id: boardAuthDto.userId, // 현재 유저 id
                board_like_board_id: boardAuthDto.boardId, // 게시글 id
            },
        })

        if (deletedRowNum > 0) {
            return { result: true, message: '좋아요 취소 성공' }
        } else if (deletedRowNum === 0) {
            return { result: false, message: '좋아요 취소 실패' }
        } else {
            return { result: false, message: req.tokenMsg || '서버 오류' }
        }
    }

    async checkFollow(boardAuthDto) {
        const followed = await db.User_follow.findOne({
            user_follow_follower_id: boardAuthDto.userId,
            user_follow_followed_id: db.sequelize.literal(`(
                    SELECT board_user_id
                    FROM Board
                    WHERE board_id = '${boardAuthDto.boardId}'
                )`),
        })

        if (followed instanceof db.User_follow) {
            return {
                result: true,
                message: '이미 팔로우한 유저',
                isFollowed: true,
            }
        } else if (followed === null) {
            return {
                result: true,
                message: '팔로우 하지 않은 유저',
                isFollowed: false,
            }
        } else {
            return { result: false, message: req.tokenMsg || '서버 오류' }
        }
    }

    async followUser(boardAuthDto) {
        const followed = await db.User_follow.findOne({
            // 이미 팔로우한 유저인지 확인
            user_follow_follower_id: boardAuthDto.userId,
            user_follow_followed_id: db.sequelize.literal(`(
                SELECT board_user_id
                FROM Board
                WHERE board_id = '${boardAuthDto.boardId}'
            )`),
        })

        if (followed instanceof db.User_follow) {
            return {
                result: false,
                message: '이미 팔로우 추가한 유저',
            }
        } else if (!(followed === null)) {
            return { result: false, message: req.tokenMsg || '서버 오류' }
        }

        const newFollow = await db.User_follow.create({
            user_follow_follower_id: boardAuthDto.userId,
            user_follow_followed_id: db.sequelize.literal(`(
                SELECT board_user_id
                FROM Board
                WHERE board_id = '${boardAuthDto.boardId}'
            )`),
        })

        if (newFollow instanceof db.User_follow) {
            return {
                result: true,
                message: '팔로우 저장 성공',
            }
        } else {
            return {
                result: false,
                message: '팔로우 저장 실패',
            }
        }
    }

    async deleteFollow(boardAuthDto) {
        const followedUser = await db.Board.findOne({
            attributes: ['board_user_id'],
            where: { board_id: boardAuthDto.boardId },
        })

        const deletedRowNum = await db.User_follow.destroy({
            where: {
                user_follow_follower_id: boardAuthDto.userId,
                user_follow_followed_id: followedUser.dataValues.board_user_id,
            },
        })

        if (deletedRowNum > 0) {
            return { result: true, message: '팔로우 취소 성공' }
        } else if (deletedRowNum === 0) {
            // 삭제되지 않았다면 현재 유저는 팔로우하지 않았던 것
            return { result: false, message: '팔로우 취소 실패' }
        } else {
            return { result: false, message: tokenMsg || '서버 오류' }
        }
    }
}
